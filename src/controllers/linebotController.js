const line = require("@line/bot-sdk");
const lineConfig = require("../config/lineConfig");
const handleMessage = require("../handlers/handleMessage");
const handlePostback = require("../handlers/handlePostback");

const client = new line.Client(lineConfig);
async function webhookHandler(req, res) {
  const events = req.body.events;

  try {
    await Promise.all(events.map(event => handleEvent(event, client)));
    res.status(200).send("OK");
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
}

async function handleEvent(event, client) {
  if (event.type === "message" && event.message.type === "text") {
    return handleMessage(event, client);
  }

  if (event.type === "postback") {
    return handlePostback(event, client);
  }

  return Promise.resolve(null);
}

module.exports = { webhookHandler };
