const { parseCustomerData } = require("../services/llmService");
const { buildFlexConfirmation } = require("../utils/flexConfirmationBuilder");
const { buildCustomerListFlex } = require("../utils/flexCustomerList");
const {
  getAllCustomers,
  getCustomersByAppointmentDate,
} = require("../services/customerService");

module.exports = async function handleMessage(event, client) {
  const userText = event.message.text.trim();

  // Check for command to view customers on a specific date
  const viewByDateRegex = /^ดูข้อมูลลูกค้าวันที่\s+(\d{1,2}\/\d{1,2}\/\d{4})$/;
  const match = userText.match(viewByDateRegex);
  if (match) {
    const date = match[1];
    const customers = await getCustomersByAppointmentDate(date);

    if (customers.length === 0) {
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: `ไม่พบข้อมูลลูกค้าในวันที่ ${date}`,
      });
    }

    const customerListByDateFlex = buildCustomerListFlex(customers);
    return client.replyMessage(event.replyToken, customerListByDateFlex);
  }

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
