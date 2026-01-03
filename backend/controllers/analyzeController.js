import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import axios from 'axios';

const SYSTEM_PROMPT = `
You are **Overbilled AI**, an expert medical billing advocate.

**CORE DIRECTIVE:**
Analyze the provided documents to uncover overcharges and missed coverage.

**OUTPUT FORMAT:**
You **MUST** return a valid **JSON object**. Do NOT return Markdown text directly.
The JSON structure must be exactly as follows:

\`\`\`json
{
  "summary": {
    "total_billed": "Amount (e.g., ₹5,000.00)",
    "insurance_paid": "Amount (e.g., ₹4,000.00)",
    "patient_responsibility": "Amount (e.g., ₹1,000.00)",
    "potential_savings": "Amount (e.g., ₹500.00)",
    "status": "Action Required | Looks Good | Critical Errors Found"
  },
  "quick_take": "One sentence summary identifying the biggest win or issue.",
  "detailed_report": "A rich Markdown string containing the full analysis. Use H2 (##) for sections like 'Critical Errors', 'Savings Opportunities', etc. Use bolding, lists, and emojis (🚨, 💰) freely within this string."
}
\`\`\`

**RULES:**
1. **summary**: Fill these fields with the best estimated numbers found or calculated. If a number is not found, use "$0.00" or "N/A".
2. **detailed_report**: This string will be rendered as Markdown. It should contain the full explanation, itemized errors, and next steps. Do NOT include the financial summary table in this markdown string, as it will be displayed separately.
3. **Strict JSON**: Your entire response must be parseable JSON. Do not add conversational text outside the JSON block.
`;

const extractText = async (file) => {
    if (file.mimetype === 'application/pdf') {
        try {
            const dataBuffer = file.buffer;
            // Convert Buffer to Uint8Array as required by PDFParse class
            const uint8Array = new Uint8Array(dataBuffer);
            const parser = new pdf.PDFParse(uint8Array);
            const data = await parser.getText();
            return data.text;
        } catch (error) {
            console.error("Error parsing PDF:", error);
            throw new Error(`Failed to parse PDF: ${file.originalname}`);
        }
    } else if (file.mimetype.startsWith('text/')) {
        return file.buffer.toString('utf8');
    } else {
        // For other types like images, we might need OCR (Tesseract), but for now return placeholder or empty.
        // Or if simple text file, just string.
        return `[Content of ${file.originalname} (Binary/Image - Text Extraction Not Implemented)]`;
    }
};

export const analyzeMedicalData = async (req, res) => {
    try {
        const files = req.files;

        // files is an object with keys 'hospitalBill' and 'insurancePolicy'
        const hospitalBill = files['hospitalBill'] ? files['hospitalBill'][0] : null;
        const insurancePolicy = files['insurancePolicy'] ? files['insurancePolicy'][0] : null;

        if (!hospitalBill) {
            return res.status(400).json({ message: 'Hospital bill is required.' });
        }

        let combinedText = "USER UPLOADED DOCUMENTS:\n\n";

        if (hospitalBill) {
            const billText = await extractText(hospitalBill);
            combinedText += `--- HOSPITAL BILL (${hospitalBill.originalname}) ---\n${billText}\n\n`;
        }

        if (insurancePolicy) {
            const policyText = await extractText(insurancePolicy);
            combinedText += `--- INSURANCE POLICY (${insurancePolicy.originalname}) ---\n${policyText}\n\n`;
        }

        // Perplexity API Call
        const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
        if (!perplexityApiKey) {
            console.log("Perplexity API Key missing. Returning mock response.");
            return res.status(200).json({
                analysis: "API Key missing. Mock analysis: Based on the documents, you have potential savings...",
                debug_text: combinedText.substring(0, 500) + "..."
            });
        }

        const response = await axios.post('https://api.perplexity.ai/chat/completions', {
            model: 'sonar-pro', // or 'sonar-reasoning-pro' or 'llama-3.1-sonar-small-128k-online'
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: combinedText }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${perplexityApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        let analysisData;
        try {
            const content = response.data.choices[0].message.content;
            // Clean up code blocks if present
            const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
            analysisData = JSON.parse(cleanContent);
        } catch (e) {
            console.error("Failed to parse AI JSON response:", e);
            // Fallback for non-JSON response
            analysisData = {
                summary: {
                    total_billed: "N/A",
                    insurance_paid: "N/A",
                    patient_responsibility: "N/A",
                    potential_savings: "N/A",
                    status: "Error Parsing"
                },
                quick_take: "We encountered an issue formatting the report, but here is the raw analysis.",
                detailed_report: response.data.choices[0].message.content
            };
        }

        res.json({ analysis: analysisData });

    } catch (error) {
        console.error("Error analyzing data:", error);
        res.status(500).json({ message: 'Error analyzing documents', error: error.message });
    }
};
