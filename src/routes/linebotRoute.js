const express = require("express");
const line = require("@line/bot-sdk");
const lineConfig = require("../config/lineConfig");
const router = express.Router();
const { webhookHandler } = require("../controllers/linebotController");
const restrictToOwner = require("../middleware/authMiddleware");
const logMiddleware = require("../middleware/logMiddleware");

router.post(
  "/webhook",
  line.middleware(lineConfig),
  logMiddleware,
  webhookHandler
);

module.exports = router;
