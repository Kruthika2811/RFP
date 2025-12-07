const express = require("express");
const router = express.Router();
const rfpCtrl = require("../controllers/rfpController");

router.post("/", rfpCtrl.createRFP);
router.get("/:id", rfpCtrl.getRFP);
router.post("/send", rfpCtrl.sendRFP); // expects { rfpId, vendorIds }
router.get("/:id/proposals", rfpCtrl.getProposalsForRFP);

module.exports = router;
