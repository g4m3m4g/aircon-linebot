const { getCustomersByAppointmentDate } = require("../../services/customerService");
const { buildCustomerListFlex } = require("../../utils/flexCustomerList");

module.exports = async function handleSearchByDate(client, replyToken, date) {
  const customers = await getCustomersByAppointmentDate(date);
  if (customers.length === 0) {
    return client.replyMessage(replyToken, {
      type: "text",
      text: `ไม่พบข้อมูลลูกค้าในวันที่ ${date}`,
    });
  }
  return client.replyMessage(replyToken, buildCustomerListFlex(customers));
};
