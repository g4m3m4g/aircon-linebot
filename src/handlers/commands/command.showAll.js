const { getAllCustomers } = require("../../services/customerService");
const { buildCustomerListFlex } = require("../../utils/flexCustomerList");

module.exports = async function handleShowAllCustomers(client, replyToken) {
  const customers = await getAllCustomers();
  if (customers.length === 0) {
    return client.replyMessage(replyToken, {
      type: "text",
      text: "ยังไม่มีข้อมูลลูกค้าในระบบ",
    });
  }
  return client.replyMessage(replyToken, buildCustomerListFlex(customers));
};
