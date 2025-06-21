const line = require("@line/bot-sdk");
const lineConfig = require("../config/lineConfig");
const { addCustomerRecord } = require("../services/sheetdbService");
const { parseCustomerData } = require("../services/llmService");

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

  // Parse customer data with LLM
  const customerData = await parseCustomerData(userText);
  if (!customerData) {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "Sorry, I could not understand the customer data. Please try again.",
    });
  }
  console.log(customerData);

  await client.replyMessage(event.replyToken, {
    type: "text",
    text: `get : ${customerData}`,
  });

  await addCustomerRecord(customerData).then(console.log("added to db"));
}

module.exports = { webhookHandler };
