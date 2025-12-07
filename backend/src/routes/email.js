const express = require("express");
const router = express.Router();
const emailCtrl = require("../controllers/emailController");

router.post("/simulate", emailCtrl.simulateVendorReply);

module.exports = router;
