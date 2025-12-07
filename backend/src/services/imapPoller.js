// const imaps = require("imap-simple");
// const simpleParser = require("mailparser").simpleParser;
// const Proposal = require("../models/Proposal");
// const Vendor = require("../models/Vendor");
// const RFP = require("../models/RFP");
// const { parseVendorEmail } = require("./aiService");

// let running = false;

// async function pollAndProcess() {
//   if (running) return;
//   running = true;
//   try {
//     const config = {
//       imap: {
//         user: process.env.IMAP_USER,
//         password: process.env.IMAP_PASS,
//         host: process.env.IMAP_HOST,
//         port: parseInt(process.env.IMAP_PORT || "993"),
//         tls: process.env.IMAP_TLS === "true",
//         authTimeout: 3000
//       }
//     };

//     const connection = await imaps.connect(config);
//     await connection.openBox("INBOX");

//     const searchCriteria = ["UNSEEN"];
//     const fetchOptions = { bodies: [""], markSeen: true };

//     const results = await connection.search(searchCriteria, fetchOptions);

//     for (const res of results) {
//       const mail = await simpleParser(res.parts[0].body);
//       const fromEmail = mail.from?.value?.[0]?.address;
//       const text = mail.text || mail.html || "";
//       // Try to find vendor by email
//       const vendor = await Vendor.findOne({ email: fromEmail });
//       if (!vendor) {
//         console.log("Unknown vendor email, skipping:", fromEmail);
//         continue;
//       }
//       // Heuristic: find RFP id in subject (we include it when sending)
//       const subject = mail.subject || "";
//       const match = subject.match(/\[RFP:(\w+)\]/);
//       let rfp = null;
//       if (match) {
//         rfp = await RFP.findById(match[1]);
//       } else {
//         // fallback: pick latest RFP
//         rfp = await RFP.findOne().sort({ createdAt: -1 });
//       }
//       const structured = await parseVendorEmail(text);
//       const proposal = new Proposal({
//         rfp: rfp?._id,
//         vendor: vendor._id,
//         email_raw: text,
//         structured
//       });
//       await proposal.save();
//       console.log("Saved proposal from", vendor.email, "for rfp", rfp?._id.toString());
//     }
//     await connection.end();
//   } catch (err) {
//     console.error("imap poll error:", err.message);
//   } finally {
//     running = false;
//   }
// }

// function startPolling(intervalSeconds = 60) {
//   setInterval(() => {
//     pollAndProcess();
//   }, intervalSeconds * 1000);
//   // also run once immediately
//   pollAndProcess().catch(e => console.error(e));
// }

// module.exports = { startPolling, pollAndProcess };



const imaps = require("imap-simple");
const { simpleParser } = require("mailparser");
const Proposal = require("../models/Proposal");
const Vendor = require("../models/Vendor");
const RFP = require("../models/RFP");
const { parseVendorEmail } = require("./aiService");

let running = false;

async function pollAndProcess() {
  if (running) return;
  running = true;

  try {
    const config = {
      imap: {
        user: process.env.IMAP_USER,
        password: process.env.IMAP_PASS,
        host: process.env.IMAP_HOST || "imap.gmail.com",
        port: parseInt(process.env.IMAP_PORT || "993"),
        tls: true,
        authTimeout: 10000,
        tlsOptions: { rejectUnauthorized: false } // required for Gmail
      }
    };

    console.log("Connecting to IMAP...");

    const connection = await imaps.connect(config);
    await connection.openBox("INBOX");

    const searchCriteria = ["UNSEEN"];
    const fetchOptions = { bodies: [""], markSeen: true };

    const results = await connection.search(searchCriteria, fetchOptions);

    console.log(`Found ${results.length} unread emails.`);

    for (const res of results) {
      const mail = await simpleParser(res.parts[0].body);

      const fromEmail = mail.from?.value?.[0]?.address;
      const text = mail.text || mail.html || "";
      const subject = mail.subject || "";

      console.log("New email from:", fromEmail);
      console.log("Subject:", subject);

      // Check if sender matches a vendor
      const vendor = await Vendor.findOne({ email: fromEmail });
      if (!vendor) {
        console.log("Skipping unknown vendor:", fromEmail);
        continue;
      }

      // Extract RFP ID from subject like: "RFP: Laptops [RFP:643c1234]"
      const match = subject.match(/\[RFP:(.*?)\]/);
      let rfp = null;

      if (match) {
        rfp = await RFP.findById(match[1]);
      } else {
        // fallback: match latest RFP if ID missing
        rfp = await RFP.findOne().sort({ createdAt: -1 });
      }

      if (!rfp) {
        console.log("No matching RFP found for vendor email.");
        continue;
      }

      // AI parses vendor proposal
      const structured = await parseVendorEmail(text);

      // Store proposal in DB
      const proposal = new Proposal({
        rfp: rfp._id,
        vendor: vendor._id,
        email_raw: text,
        structured
      });

      await proposal.save();
      console.log(`Saved proposal from ${vendor.email} for RFP ${rfp._id}`);
    }

    await connection.end();
  } catch (err) {
    console.error("IMAP poll error:", err.message);
  } finally {
    running = false;
  }
}

function startPolling(intervalSeconds = 60) {
  console.log(`IMAP Polling started (every ${intervalSeconds} seconds)...`);
  setInterval(pollAndProcess, intervalSeconds * 1000);
  pollAndProcess().catch(err => console.error("Initial poll error:", err));
}

module.exports = { startPolling, pollAndProcess };
