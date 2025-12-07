const mongoose = require("mongoose");

const ProposalSchema = new mongoose.Schema({
  rfp: { type: mongoose.Schema.Types.ObjectId, ref: "RFP" },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  email_raw: String,
  structured: { type: Object, default: {} },
  score: Number,
  recommendation: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Proposal", ProposalSchema);
