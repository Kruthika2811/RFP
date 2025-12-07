const Proposal = require("../models/Proposal");
const Vendor = require("../models/Vendor");
const RFP = require("../models/RFP");
const { parseVendorEmail } = require("../services/aiService");

/**
 * Handy endpoint to simulate vendor reply (useful for demoing without IMAP).
 * Body: { vendorEmail, rfpId, body }
 */
async function simulateVendorReply(req, res) {
  try {
    const { vendorEmail, rfpId, body } = req.body;
    const vendor = await Vendor.findOne({ email: vendorEmail });
    if (!vendor) return res.status(404).send("Vendor not found");
    const rfp = await RFP.findById(rfpId);
    const structured = await parseVendorEmail(body);
    const prop = new Proposal({
      rfp: rfp._id,
      vendor: vendor._id,
      email_raw: body,
      structured
    });
    await prop.save();
    res.json({ ok: true, proposal: prop });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { simulateVendorReply };
