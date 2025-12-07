const express = require("express");
const router = express.Router();
const vendorCtrl = require("../controllers/vendorController");

router.post("/", vendorCtrl.addVendor);
router.get("/", vendorCtrl.listVendors);

module.exports = router;
