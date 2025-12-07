const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  specs: mongoose.Schema.Types.Mixed // flexible key/values
}, { _id: false });

const RFPSchema = new mongoose.Schema({
  title: String,
  description_raw: String,
  structured: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("RFP", RFPSchema);
