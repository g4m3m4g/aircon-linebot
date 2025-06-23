const { parseCustomerData } = require("../services/llmService");
const { buildFlexConfirmation } = require("../utils/flexConfirmationBuilder");
const { buildCustomerListFlex } = require("../utils/flexCustomerList");
const { getAllCustomers } = require("../services/customerService");

module.exports = async function handleMessage(event, client) {
  const userText = event.message.text;

  if (userText === "ดูข้อมูลลูกค้า") {
    const customers = await getAllCustomers();

    if (customers.length === 0) {
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "ยังไม่มีข้อมูลลูกค้าในระบบ",
      });
    }

    const customerListFlex = buildCustomerListFlex(customers);
    return client.replyMessage(event.replyToken, customerListFlex);
  }

  const customerData = await parseCustomerData(userText);
  if (!customerData) {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "ขออภัย ไม่สามารถเข้าใจข้อมูลลูกค้าได้ กรุณาตรวจสอบอีกครั้ง",
    });
  }

  const confirmationflex = buildFlexConfirmation(customerData);

  return client.replyMessage(event.replyToken, {
    type: "flex",
    altText: "ยืนยันข้อมูลลูกค้า",
    contents: confirmationflex,
  });
};
