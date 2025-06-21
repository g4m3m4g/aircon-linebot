const express = require("express");
const line = require("@line/bot-sdk");
const lineConfig = require("../config/lineConfig");
const router = express.Router();
const { webhookHandler } = require("../controllers/linebotController");
const restrictToOwner = require("../middleware/authMiddleware");

router.post(
  "/webhook",
  line.middleware(lineConfig),
  restrictToOwner,
  webhookHandler
);

module.exports = router;
