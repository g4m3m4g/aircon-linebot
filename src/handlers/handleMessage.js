const { parseCustomerData } = require("../services/llmService");
const { buildFlexConfirmation } = require("../utils/flexBuilder");

module.exports = async function handleMessage(event, client) {
  const userText = event.message.text;
  const customerData = await parseCustomerData(userText);

  if (!customerData) {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "ขออภัย ไม่สามารถเข้าใจข้อมูลลูกค้าได้ กรุณาตรวจสอบอีกครั้ง",
    });
  }

  const flex = buildFlexConfirmation(customerData);

  return client.replyMessage(event.replyToken, {
    type: "flex",
    altText: "ยืนยันข้อมูลลูกค้า",
    contents: flex,
  });
};
