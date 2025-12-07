const RFP = require("../models/RFP");
const Proposal = require("../models/Proposal");
const { parseRFPTextToStructured, compareProposals } = require("../services/aiService");
const Vendor = require("../models/Vendor");
const { sendRFPEmail } = require("../services/emailService");

async function createRFP(req, res) {
  try {
    const { text } = req.body;
    const structured = await parseRFPTextToStructured(text);
    const title = structured.title || (text.slice(0, 40));
    const rfp = new RFP({ title, description_raw: text, structured });
    await rfp.save();
    res.json(rfp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getRFP(req, res) {
  try {
    const rfp = await RFP.findById(req.params.id);
    if (!rfp) return res.status(404).send("Not found");
    res.json(rfp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function sendRFP(req, res) {
  try {
    const { rfpId, vendorIds } = req.body;
    const rfp = await RFP.findById(rfpId);
    if (!rfp) return res.status(404).send("RFP not found");
    const vendors = await Vendor.find({ _id: { $in: vendorIds } });
    const subject = `${rfp.title} [RFP:${rfp._id}]`;
    const text = `Please see the RFP details:\n\n${JSON.stringify(rfp.structured, null, 2)}\n\nReply to this email with your proposal.`;
    const responses = [];
    for (const v of vendors) {
      const info = await sendRFPEmail({ to: v.email, subject, text });
      responses.push({ vendor: v.email, infoId: info.messageId || info.response });
    }
    res.json({ sent: responses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getProposalsForRFP(req, res) {
  try {
    const rfpId = req.params.id;
    const proposals = await Proposal.find({ rfp: rfpId }).populate("vendor");
    // call AI to compare
    const rfp = await RFP.findById(rfpId);
    const proposalsForAI = proposals.map(p => ({ vendor: p.vendor.name, structured: p.structured }));
    const comparison = await compareProposals(rfp.structured, proposalsForAI);
    // Optionally store scores back to proposals if returned
    if (Array.isArray(comparison.scores)) {
      for (const s of comparison.scores) {
        const prop = proposals.find(p => p.vendor.name === s.vendor);
        if (prop) {
          prop.score = s.score;
          prop.recommendation = s.summary || "";
          await prop.save();
        }
      }
    }
    res.json({ proposals, comparison });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createRFP, getRFP, sendRFP, getProposalsForRFP
};
