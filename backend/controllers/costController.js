import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import axios from 'axios';

const SYSTEM_PROMPT = `
Role
You are a **Cost of Inaction Analysis Agent** operating inside Overbilled, an AI system that helps patients understand the hidden financial trade-offs of ignoring or delaying action on a medical bill.

Your responsibility is to simulate and clearly communicate what changes over time when no action is taken, based on common healthcare billing timelines, insurer behavior, and patient decision patterns.

**Objective**
Given a medical bill amount and (optionally) insurance status, denial indicators, or documentation risk signals, and potentially an annual family income, estimate what a patient implicitly accepts by waiting.

**What to Simulate:**
1. Time-Based Leverage Drift (30/60/90 days)
2. Missed Dispute & Clarification Opportunities
3. Insurance Leverage Decay
4. Psychological Inertia Cost

**Behavioral Framing (CRITICAL):**
- Frame inaction as a deliberate choice with trade-offs.
- Avoid urgency, warnings, or fear-based framing.
- Use reverse psychology: "Here is what you are choosing to give up by doing nothing."

**Output Requirements:**
You **MUST** return a valid **JSON object**. Do NOT return Markdown text directly.
The JSON structure must be exactly as follows:

\`\`\`json
{
  "current_bill_amount": "$X",
  "what_changes_if_you_wait": {
    "30_days": "Most clarification and dispute options are still available, but require proactive effort.",
    "60_days": "Some leverage may be reduced as appeal and adjustment windows narrow.",
    "90_plus_days": "The bill is more likely to be treated as accepted, limiting flexibility."
  },
  "value_left_on_the_table": {
    "estimated_range": "$X – $Y",
    "why": "This represents potential adjustments or reductions that become harder to pursue over time."
  },
  "key_tradeoffs_of_inaction": [
    "Reduced ability to question or clarify charges",
    "Lower insurer responsiveness as claims age",
    "Higher likelihood of paying without scrutiny"
  ],
  "behavioral_insight": "Most people don’t overpay because the bill increases — they overpay because they stop questioning it.",
  "confidence_note": "These estimates are simulated, conservative projections highlighting opportunity cost, not guaranteed outcomes."
}
\`\`\`
`;

const extractText = async (file) => {
    if (file.mimetype === 'application/pdf') {
        try {
            const dataBuffer = file.buffer;
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
        throw new Error(`Unsupported file type: ${file.mimetype}`);
    }
};

export const analyzeCost = async (req, res) => {
    try {
        const files = req.files;
        const { annualIncome } = req.body;

        if (!files || (!files.hospitalBill && !files.policyFile)) {
            return res.status(400).json({ error: 'Please upload at least a hospital bill or policy file.' });
        }

        let extractedText = "";

        // Process Hospital Bill
        if (files.hospitalBill) {
            try {
                const billText = await extractText(files.hospitalBill[0]);
                extractedText += `\n\n--- HOSPITAL BILL CONTENT ---\n${billText}`;
            } catch (error) {
                return res.status(400).json({ error: `Error processing bill: ${error.message}` });
            }
        }

        // Process Policy File (Optional)
        if (files.policyFile) {
            try {
                const policyText = await extractText(files.policyFile[0]);
                extractedText += `\n\n--- INSURANCE POLICY CONTENT ---\n${policyText}`;
            } catch (error) {
                console.warn(`Error processing policy: ${error.message}`);
                extractedText += `\n\n(Policy file upload failed: ${error.message})`;
            }
        }

        // Add User Context
        const userContext = `\n\n--- USER CONTEXT ---\nAnnual Family Income: ${annualIncome || "Not Provided"}`;

        // Call Perplexity API
        const options = {
            method: 'POST',
            url: 'https://api.perplexity.ai/chat/completions',
            headers: {
                'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                'Content-Type': 'application/json'
            },
            data: {
                model: "sonar-pro",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: `Here is the medical bill and context data to analyze:\n${extractedText}\n${userContext}` }
                ],
                max_tokens: 3000,
                temperature: 0.2,
                top_p: 0.9,
                return_images: false,
                return_related_questions: false,
                stream: false,
                presence_penalty: 0,
                frequency_penalty: 1
            }
        };

        const response = await axios.request(options);
        const content = response.data.choices[0].message.content;

        // Clean and Parse JSON
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);

        let analysisData;
        if (jsonMatch) {
            try {
                const jsonString = jsonMatch[1] ? jsonMatch[1] : jsonMatch[0];
                analysisData = JSON.parse(jsonString);
            } catch (e) {
                console.error("JSON Parse Error:", e);
                console.error("Raw Content:", content);
                // Fallback if JSON is malformed
                analysisData = {
                    error: "Failed to parse AI response",
                    raw_response: content
                };
            }
        } else {
            analysisData = {
                error: "No JSON found in response",
                raw_response: content
            };
        }

        res.json({ success: true, analysis: analysisData });

    } catch (error) {
        console.error('Cost Analysis Error:', error);
        res.status(500).json({ error: 'Failed to analyze cost of inaction.' });
    }
};
