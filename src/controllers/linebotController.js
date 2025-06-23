const line = require("@line/bot-sdk");
const lineConfig = require("../config/lineConfig");
const handleMessage = require("../handlers/handleMessage");
const handlePostback = require("../handlers/handlePostback");
const { isUserAllowed } = require("../middleware/authMiddleware");

const client = new line.Client(lineConfig);
async function webhookHandler(req, res) {
  const events = req.body.events;
  try {
    await Promise.all(events.map((event) => handleEvent(event, client)));
    res.status(200).send("OK");
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
}

async function handleEvent(event, client) {
  if (!isUserAllowed(event.source.userId)) {
    // Just log and skip reply to save quota
    console.log("Blocked user:", event.source.userId);
    await client.pushMessage(event.source.userId, {
      type: "text",
      text: "⛔ คุณไม่มีสิทธิ์ใช้งาน",
    });
    return;
  }

  if (event.type === "message" && event.message.type === "text") {
    return handleMessage(event, client);
  }

  if (event.type === "postback") {
    return handlePostback(event, client);
  }

  return Promise.resolve(null);
}

module.exports = { webhookHandler };
