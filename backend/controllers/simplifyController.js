import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import axios from 'axios';

const SYSTEM_PROMPT = `
**ROLE**: 
You are the "OVERBILLED Health Advisor." Your job is to take a messy, jargon-heavy medical bill and rewrite it as a "Patient Narrative." You explain the *reason* for every charge based on symptoms and care logic, not just the name of the code.

**INPUT**: 
A medical bill (Itemized Statement/EOB) in text or PDF format.

**TASK**:
1. **Clinical Narrative**: Write a 3-sentence "Executive Summary" of the medical event (e.g., "You visited the ER for a suspected fracture; they performed an X-ray, stabilized your ankle, and provided pain management.")
2. **Simplified Breakdown**: Group line items into 4-5 "Human Categories":
    - **"The Visit"** (Room, Nursing, ER fees)
    - **"The Investigation"** (Labs, Scans, Bloodwork)
    - **"The Treatment"** (Surgery, Procedures, Doctor fees)
    - **"The Pharmacy"** (Meds, IV fluids)
3. **The "Why" Factor**: For every major charge, explain:
    - **What it is**: Simple language (e.g., "High-strength Ibuprofen" instead of "IV Toradol").
    - **What symptom it treated**: Link it to likely symptoms (e.g., "To manage the intense pain you reported").
4. **Interactive Audit Q&A**: Prepare to answer questions about specific lines. Maintain a memory of the user's reported symptoms to identify mismatches.
5. **Body Map Data**: Identify which organs or body parts were likely affected or treated based on the procedures/tests (e.g., "Brain" for Head CT, "Lungs" for Chest X-Ray).

**OUTPUT FORMAT**:
You **MUST** return a valid **JSON object** with the following structure:
\`\`\`json
{
  "summary": "...",
  "human_bill": [
    {
      "category": "The Investigation",
      "items": [
        {
          "original_name": "CT HEAD W/O CONTRAST",
          "simple_name": "Brain Scan (No Dye)",
          "cost": 1200.00,
          "advisor_note": "This was likely ordered to check for internal bleeding after your fall. It is a standard safety check."
        }
      ]
    }
  ],
  "affected_organs": ["Brain", "Lungs", "Heart", "Stomach", "Kidneys", "Limbs"],
  "red_flags": [
    "You were charged for a 'Level 5 ER Visit,' which is usually for life-threatening emergencies. Your notes say you were stable."
  ],
  "suggested_questions": ["Why was I billed for a private room when I was in a shared bay?"]
}
\`\`\`
Return ONLY the JSON object.
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
    } else {
        return `[Content of ${file.originalname} (Binary/Image - Text Extraction Not Implemented)]`;
    }
};

export const simplifyBill = async (req, res) => {
    try {
        const files = req.files;
        const hospitalBill = files['hospitalBill'] ? files['hospitalBill'][0] : null;

        if (!hospitalBill) {
            return res.status(400).json({ message: 'Hospital bill is required.' });
        }

        let combinedText = "USER UPLOADED DOCUMENTS:\n\n";

        if (hospitalBill) {
            const billText = await extractText(hospitalBill);
            combinedText += `--- HOSPITAL BILL (${hospitalBill.originalname}) ---\n${billText}\n\n`;
        }

        // Perplexity API Call
        const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
        if (!perplexityApiKey) {
            // Mock response for dev without API key
            return res.status(200).json({
                analysis: {
                    summary: "Mock Summary: API Key Missing.",
                    human_bill: [],
                    affected_organs: [],
                    red_flags: [],
                    suggested_questions: []
                }
            });
        }

        const response = await axios.post('https://api.perplexity.ai/chat/completions', {
            model: 'sonar-pro',
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
            const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
            analysisData = JSON.parse(cleanContent);
        } catch (e) {
            console.error("Failed to parse AI JSON response:", e);
            analysisData = {
                summary: "Error parsing AI response.",
                raw_response: response.data.choices[0].message.content,
                human_bill: [],
                affected_organs: [],
                red_flags: [],
                suggested_questions: []
            };
        }

        res.json({ analysis: analysisData });

    } catch (error) {
        console.error("Error simplifying bill:", error);
        res.status(500).json({ message: 'Error simplifying bill', error: error.message });
    }
};
