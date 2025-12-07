


// // const { GoogleGenerativeAI } = require("@google/generative-ai");

// // // Load Gemini Model
// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// // /**
// //  * Helper: Force Gemini to return clean JSON
// //  */
// // function extractJSON(text) {
// //   try {
// //     // Extract JSON between <json>...</json> if present
// //     const match = text.match(/<json>([\s\S]*?)<\/json>/);
// //     const clean = match ? match[1] : text;
// //     return JSON.parse(clean);
// //   } catch (err) {
// //     return null;
// //   }
// // }

// // /**
// //  * Parse RFP text
// //  */
// // async function parseRFPTextToStructured(text) {
// //   const prompt = `
// // Convert the following RFP text into a **clean JSON** with fields:
// // - title
// // - items: [{ name, quantity, specs }]
// // - budget
// // - delivery_days
// // - warranty
// // - payment_terms
// // - notes

// // Respond ONLY inside:
// // <json> ... </json>

// // RFP text:
// // ${text}
// // `;

// //   try {
// //     const result = await model.generateContent(prompt);
// //     const raw = result.response.text();

// //     const parsed = extractJSON(raw);

// //     if (parsed) return parsed;

// //     return { title: "Parsed RFP", items: [], notes: text, ai_raw: raw };
// //   } catch (err) {
// //     console.error("RFP parse error:", err.message);
// //     return { title: "Parsed RFP", items: [], notes: text };
// //   }
// // }

// // /**
// //  * Parse vendor email
// //  */
// // async function parseVendorEmail(emailText) {
// //   const prompt = `
// // Extract structured proposal information from this vendor email.

// // Return JSON ONLY inside:
// // <json>...</json>

// // Include:
// // - items with pricing
// // - total price
// // - delivery_days
// // - warranty
// // - payment_terms
// // - extra_notes

// // Email:
// // ${emailText}
// // `;

// //   try {
// //     const result = await model.generateContent(prompt);
// //     const raw = result.response.text();

// //     const parsed = extractJSON(raw);

// //     if (parsed) return parsed;

// //     return { notes: emailText, ai_raw: raw };
// //   } catch (err) {
// //     console.error("Vendor parse error:", err.message);
// //     return { notes: emailText };
// //   }
// // }

// // /**
// //  * Compare proposals
// //  */
// // async function compareProposals(rfpStructured, proposals) {
// //   const prompt = `
// // Compare the following RFP and proposals.

// // Return JSON ONLY inside:
// // <json>...</json>

// // JSON Format:
// // {
// //   "vendor_scores": [
// //      { "vendor": "Vendor Name", "score": 0-100, "summary": "..." }
// //   ],
// //   "recommended_vendor": "name",
// //   "reasoning": "why selected"
// // }

// // RFP:
// // ${JSON.stringify(rfpStructured, null, 2)}

// // Proposals:
// // ${JSON.stringify(proposals, null, 2)}
// // `;

// //   try {
// //     const result = await model.generateContent(prompt);
// //     const raw = result.response.text();

// //     const parsed = extractJSON(raw);
// //     if (parsed) return parsed;

// //     return { ai_raw: raw };
// //   } catch (err) {
// //     console.error("Comparison error:", err.message);
// //     return { ai_raw: "Comparison failed" };
// //   }
// // }

// // module.exports = {
// //   parseRFPTextToStructured,
// //   parseVendorEmail,
// //   compareProposals
// // };



// const { GoogleGenerativeAI } = require("@google/generative-ai");

// // Load Gemini Model (CORRECT MODEL)
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// /**
//  * Extract JSON safely
//  */
// function extractJSON(text) {
//   try {
//     const match = text.match(/<json>([\s\S]*?)<\/json>/);
//     const clean = match ? match[1] : text;
//     return JSON.parse(clean);
//   } catch {
//     return null;
//   }
// }

// /**
//  * Parse RFP text
//  */
// async function parseRFPTextToStructured(text) {
//   const prompt = `
// Convert the following RFP text into a clean JSON with fields:
// - title
// - items: [{ name, quantity, specs }]
// - budget
// - delivery_days
// - warranty
// - payment_terms
// - notes

// Respond ONLY using:
// <json> ... </json>

// RFP text:
// ${text}
//   `;

//   try {
//     const result = await model.generateContent(prompt);
//     const raw = result.response.text();
//     const parsed = extractJSON(raw);

//     if (parsed) return parsed;

//     return { title: "Parsed RFP", items: [], notes: text, ai_raw: raw };
//   } catch (err) {
//     console.error("RFP parse error:", err.message);
//     return { title: "Parsed RFP", items: [], notes: text };
//   }
// }

// /**
//  * Parse vendor email
//  */
// async function parseVendorEmail(emailText) {
//   const prompt = `
// Extract structured proposal information from this vendor email.

// Return ONLY:
// <json>...</json>

// Include:
// - items with price per item
// - total price
// - delivery_days
// - warranty
// - payment_terms
// - extra_notes

// Email:
// ${emailText}
//   `;

//   try {
//     const result = await model.generateContent(prompt);
//     const raw = result.response.text();
//     const parsed = extractJSON(raw);

//     if (parsed) return parsed;

//     return { notes: emailText, ai_raw: raw };
//   } catch (err) {
//     console.error("Vendor parse error:", err.message);
//     return { notes: emailText };
//   }
// }

// /**
//  * Compare proposals
//  */
// async function compareProposals(rfpStructured, proposals) {
//   const prompt = `
// Compare the following RFP and proposals.

// Return strictly inside:
// <json>...</json>

// Format:
// {
//   "vendor_scores": [
//      { "vendor": "Vendor Name", "score": 0-100, "summary": "..." }
//   ],
//   "recommended_vendor": "Vendor Name",
//   "reasoning": "..."
// }

// RFP:
// ${JSON.stringify(rfpStructured, null, 2)}

// Proposals:
// ${JSON.stringify(proposals, null, 2)}
//   `;

//   try {
//     const result = await model.generateContent(prompt);
//     const raw = result.response.text();
//     const parsed = extractJSON(raw);

//     if (parsed) return parsed;

//     return { ai_raw: raw };
//   } catch (err) {
//     console.error("Comparison error:", err.message);
//     return { ai_raw: "Comparison failed" };
//   }
// }

// module.exports = {
//   parseRFPTextToStructured,
//   parseVendorEmail,
//   compareProposals
// };


const { GoogleGenerativeAI } = require("@google/generative-ai");

// Use gemini-1.0-pro (the only model your API key supports)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

// Extract JSON safely
function extractJSON(text) {
  try {
    const match = text.match(/<json>([\s\S]*?)<\/json>/);
    const clean = match ? match[1] : text;
    return JSON.parse(clean);
  } catch (err) {
    return null;
  }
}

/**
 * Parse RFP Text
 */
async function parseRFPTextToStructured(text) {
  const prompt = `
Convert the RFP text into a JSON object with:
- title
- items: [{ name, quantity, specs }]
- budget
- delivery_days
- warranty
- payment_terms
- notes

Return ONLY JSON wrapped inside:
<json>...</json>

Text:
${text}
`;

  try {
    const res = await model.generateContent(prompt);
    const raw = res.response.text();
    const parsed = extractJSON(raw);
    return parsed || { title: "Parsed RFP", items: [], notes: text, ai_raw: raw };
  } catch (err) {
    console.error("RFP parse error:", err.message);
    return { title: "Parsed RFP", items: [], notes: text };
  }
}

/**
 * Parse Vendor Email
 */
async function parseVendorEmail(emailText) {
  const prompt = `
Extract proposal details.

Return ONLY JSON inside:
<json>...</json>

Include:
- items with pricing
- total price
- delivery_days
- warranty
- payment_terms
- extra_notes

Email:
${emailText}
`;

  try {
    const res = await model.generateContent(prompt);
    const raw = res.response.text();
    const parsed = extractJSON(raw);
    return parsed || { notes: emailText, ai_raw: raw };
  } catch (err) {
    console.error("Vendor parse error:", err.message);
    return { notes: emailText };
  }
}

/**
 * Compare Proposals
 */
async function compareProposals(rfpStructured, proposals) {
  const prompt = `
Compare RFP and proposals.

Return JSON ONLY inside:
<json>...</json>

Format:
{
  "vendor_scores": [
    { "vendor": "Name", "score": 0-100, "summary": "..." }
  ],
  "recommended_vendor": "Name",
  "reasoning": "..."
}

RFP:
${JSON.stringify(rfpStructured, null, 2)}

Proposals:
${JSON.stringify(proposals, null, 2)}
`;

  try {
    const res = await model.generateContent(prompt);
    const raw = res.response.text();
    const parsed = extractJSON(raw);
    return parsed || { ai_raw: raw };
  } catch (err) {
    console.error("Comparison error:", err.message);
    return { ai_raw: "Comparison failed" };
  }
}

module.exports = {
  parseRFPTextToStructured,
  parseVendorEmail,
  compareProposals
};
