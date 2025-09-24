const { parseCustomerData } = require("../../services/llmGeminiService");
const {
  buildFlexConfirmation,
} = require("../../utils/flexConfirmationBuilder");

module.exports = async function handleNewCustomer(
  client,
  replyToken,
  userText
) {
  const customerData = await parseCustomerData(userText);
  if (!customerData) {
    return client.replyMessage(replyToken, {
      type: "text",
      text: "ขออภัย ไม่สามารถเข้าใจข้อมูลลูกค้าได้ กรุณาตรวจสอบอีกครั้ง",
    });
  }

  const confirmationFlex = buildFlexConfirmation(customerData);
  return client.replyMessage(replyToken, {
    type: "flex",
    altText: "ยืนยันข้อมูลลูกค้า",
    contents: confirmationFlex,
  });
};
