
const { addCustomerRecordToMongo } = require("../services/customerService");

module.exports = async function handlePostback(event, client) {
  let postbackData;
  try {
    postbackData = JSON.parse(event.postback.data);
  } catch (err) {
    return client.pushMessage(event.source.userId, {
      type: "text",
      text: "❌ ไม่สามารถอ่านข้อมูลได้",
    });
  }

  if (postbackData.action === "confirm") {
    const customerData = postbackData.customerData;

    // Inform user that saving is in progress
    await client.pushMessage(event.source.userId, {
      type: "text",
      text: "⏳ กำลังบันทึกข้อมูลลูกค้า...",
    });

    try {
      await addCustomerRecordToMongo(customerData);
      return client.pushMessage(event.source.userId, {
        type: "text",
        text: "✅ บันทึกข้อมูลลูกค้าเรียบร้อยแล้ว",
      });
    } catch (err) {
      console.error("Error saving to DB:", err);
      return client.pushMessage(event.source.userId, {
        type: "text",
        text: "❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล",
      });
    }
  }

  if (postbackData.action === "cancel") {
    return client.pushMessage(event.source.userId, {
      type: "text",
      text: "❌ ยกเลิกการบันทึกข้อมูลแล้ว",
    });
  }

  return Promise.resolve(null);
};
