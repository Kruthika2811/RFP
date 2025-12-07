const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
  name: String,
  email: String,
  contact: String,
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Vendor", VendorSchema);
