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
4. **Dont use emojis**
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

const POLICY_CHECK_PROMPT = `
**ROLE**: 
You are the "OVERBILLED Fraud & Denial Detective." You are a cynical, high-level forensic auditor. Your goal is to determine if a medical bill is fraudulent (Scam) or if an insurance denial is a "Bad Faith" rejection (Slam).

**INPUT**: 
1. Itemized Medical Bill (PDF/Image)
2. Insurance Denial Form / EOB
3. Clinical Notes (Optional but preferred)

**MISSION**:
1. **The Fraud Check (Provider Side)**: Scan the bill for "Red Flags" like:
    - **Upcoding**: Billing a simple visit as a life-threatening emergency.
    - **Unbundling**: Charging for "Sutures" and "Anesthesia" separately when they should be part of a "Surgery Suite" fee.
    - **Phantom Charges**: Charges for services that clinical notes prove never happened.
2. **The Denial Check (Payer Side)**: Analyze the insurance rejection code. Determine if it is:
    - **Administrative**: A simple typo or missing info (Valid but fixable).
    - **Medical Necessity**: Claiming a procedure wasn't needed despite doctor's notes (Likely Bad Faith).
    - **Policy Trap**: Hiding behind fine print that contradicts the patient's benefits.
3. **The Verdict**: Provide a definitive 'Scam Likelihood' score and a 'Fightability' score.

**UX OUTPUT REQUIREMENTS**:
Output a JSON structure that allows the frontend to render:
- **The Scam Meter**: A 0-100% gauge (0 = Valid, 100 = Blatant Scam).
- **The Evidence Map**: A list of "Detected Crimes" with direct quotes from the documents.
- **The "Slam" Counter**: If the insurance denied it, explain why they are wrong using medical jargon they can't ignore.

**JSON FORMAT**:
\`\`\`json
{
  "scam_score": number, // 0-100
  "fightability_score": number, // 0-100
  "evidence_map": [
    {
      "crime": "String (e.g. Upcoding)",
      "quote": "String (Direct quote from doc)",
      "analysis": "String (Why this is suspicious)"
    }
  ],
  "slam_counter": "String (The specific argument to fight back with)",
  "verdict_summary": "String (1-2 sentences summarizing the finding)"
}
\`\`\`
`;

// Helper to extract JSON from AI response text
const extractJson = (text) => {
    try {
        // 1. Try simple parse first
        return JSON.parse(text);
    } catch (e) {
        // 2. Try to find the first '{' and last '}'
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            try {
                const jsonStr = text.substring(start, end + 1);
                return JSON.parse(jsonStr);
            } catch (e2) {
                console.error("JSON extraction failed after substring:", e2);
            }
        }
        // 3. Fallback: Try removing markdown
        const cleanContent = text.replace(/```json\n?|\n?```/g, '').trim();
        try {
            return JSON.parse(cleanContent);
        } catch (e3) {
            throw new Error("Could not parse JSON from response");
        }
    }
};

export const analyzePolicyCheck = async (req, res) => {
    try {
        const files = req.files;
        const policyFile = files['policyFile'] ? files['policyFile'][0] : null;
        const medicalDocs = files['medicalDocs'] || [];
        const denialDocs = files['denialDocs'] || [];

        if (!policyFile) {
            return res.status(400).json({ message: 'Insurance Policy file is required.' });
        }
        if (medicalDocs.length === 0) {
            return res.status(400).json({ message: 'At least one Medical Document is required.' });
        }

        let combinedText = "USER UPLOADED DOCUMENTS FOR FRAUD ANALYSIS:\n\n";

        // 1. Extract Policy
        const policyText = await extractText(policyFile);
        combinedText += `--- INSURANCE POLICY (${policyFile.originalname}) ---\n${policyText}\n\n`;

        // 2. Extract Medical Docs
        for (const doc of medicalDocs) {
            const text = await extractText(doc);
            combinedText += `--- MEDICAL DOCUMENT (${doc.originalname}) ---\n${text}\n\n`;
        }

        // 3. Extract Denial Docs
        if (denialDocs.length > 0) {
            for (const doc of denialDocs) {
                const text = await extractText(doc);
                combinedText += `--- DENIAL/REJECTION LETTER (${doc.originalname}) ---\n${text}\n\n`;
            }
        } else {
            combinedText += "--- NO DENIAL DOCUMENTS PROVIDED ---\n(Analyze for potential future denial risks or existing bill fraud only)\n\n";
        }


        const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
        if (!perplexityApiKey) {
            // Mock Response for dev without API key
            return res.status(200).json({
                analysis: {
                    scam_score: 85,
                    fightability_score: 90,
                    evidence_map: [
                        { crime: "Upcoding", quote: "Level 5 Emergency Dept Visit", analysis: "Clinical notes describe a minor finger scrape treated with band-aid." },
                        { crime: "Unbundling", quote: "Surgical Tray - $500", analysis: "Should be included in the primary procedure code." }
                    ],
                    slam_counter: "The denial for 'Medical Necessity' is invalid. Patient presented with erratic vitals (BP 180/110) requiring immediate stabilization, as documented in nursing notes on page 3.",
                    verdict_summary: "Highly suspicious billing practices detected. The provider is upcoding minor services, but the insurance denial is also seemingly bad faith."
                }
            });
        }

        const response = await axios.post('https://api.perplexity.ai/chat/completions', {
            model: 'sonar-pro',
            messages: [
                { role: 'system', content: POLICY_CHECK_PROMPT + "\n\nIMPORTANT: OUTPUT RAW JSON ONLY. NO PREAMBLE. NO MARKDOWN BLOCK." },
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
            analysisData = extractJson(content);
        } catch (e) {
            console.error("Failed to parse AI JSON response:", e);
            console.error("Raw content:", response.data.choices[0].message.content);
            analysisData = {
                scam_score: 0,
                fightability_score: 0,
                evidence_map: [],
                slam_counter: "Error parsing AI response. Please try again.",
                verdict_summary: "System error: AI returned invalid format."
            };
        }

        res.json({ analysis: analysisData });

    } catch (error) {
        console.error("Error in policy check:", error);
        res.status(500).json({ message: 'Error analyzing documents', error: error.message });
    }
};
