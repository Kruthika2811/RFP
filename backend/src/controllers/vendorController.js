const Vendor = require("../models/Vendor");

async function addVendor(req, res) {
  try {
    const { name, email, contact } = req.body;
    const v = new Vendor({ name, email, contact });
    await v.save();
    res.json(v);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listVendors(req, res) {
  const vendors = await Vendor.find();
  res.json(vendors);
}

module.exports = { addVendor, listVendors };
