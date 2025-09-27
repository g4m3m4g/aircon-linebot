const { parseUpdateCustomerData } = require("../../services/llmGeminiService");

const { getCustomersByNameAndDate } = require("../../services/customerService");
const {
  buildFlexUpdateConfirmation,
} = require("../../utils/flexUpdateConfirmationBuilder");

module.exports = async function handleUpdateCustomer(
  client,
  replyToken,
  userText
) {
  const newData = await parseUpdateCustomerData(userText);

  if (!newData || !newData.name || !newData.appointment_date) {
    return client.replyMessage(replyToken, {
      type: "text",
      text: "❌ ต้องระบุชื่อและวันที่นัดของลูกค้าเพื่ออัปเดต",
    });
  }

  // ดึงข้อมูลเก่าจาก
  const oldData = await getCustomersByNameAndDate(
    newData.name,
    newData.appointment_date
  );
  if (!oldData) {
    return client.replyMessage(replyToken, {
      type: "text",
      text: `❌ ไม่พบลูกค้า "${newData.name}" ในวันที่ ${newData.appointment_date}`,
    });
  }

  const flexMessage = buildFlexUpdateConfirmation(oldData, newData);

  return client.replyMessage(replyToken, {
    type: "flex",
    altText: "ยืนยันการอัปเดตข้อมูลลูกค้า",
    contents: flexMessage,
  });
};
