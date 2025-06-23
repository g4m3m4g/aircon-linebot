const { getCustomersByName } = require("../../services/customerService");
const { buildCustomerListFlex } = require("../../utils/flexCustomerList");

module.exports = async function handleSearchByName(client, replyToken, name) {
  const customers = await getCustomersByName(name);
  if (customers.length === 0) {
    return client.replyMessage(replyToken, {
      type: "text",
      text: `ไม่พบข้อมูลลูกค้าชื่อ "${name}"`,
    });
  }
  return client.replyMessage(replyToken, buildCustomerListFlex(customers));
};
