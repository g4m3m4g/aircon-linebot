const line = require("@line/bot-sdk");
const lineConfig = require("../config/lineConfig");

const client = new line.Client(lineConfig);
async function webhookHandler(req, res) {
  const events = req.body.events;

  try {
    await Promise.all(events.map(handleEvent));
    res.status(200).send("OK");
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
}

async function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null); // ignore non-text or non-message events
  }

  const userText = event.message.text;
  await client.replyMessage(event.replyToken, {
    type: "text",
    text: `get : ${userText}`,
  });
}

module.exports = { webhookHandler };
