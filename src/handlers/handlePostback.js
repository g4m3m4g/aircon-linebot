const {
  addCustomerRecordToMongo,
  updateCustomerByNameAndDate,
  getCustomerById,
} = require("../services/customerService");

const {
  buildFlexUpdateConfirmation,
} = require("../utils/flexUpdateConfirmationBuilder");

module.exports = async function handlePostback(event, client) {
  let postbackData;
  try {
    postbackData = JSON.parse(event.postback.data);
    // console.log("📌 postbackData:", postbackData);
    // console.log("📌 newData:", postbackData.newData);
  } catch (err) {
    console.error("❌ Error parsing postback data:", err);
    return client.pushMessage(event.source.userId, {
      type: "text",
      text: "❌ ไม่สามารถอ่านข้อมูลได้",
    });
  }

  // --------- Confirm New Customer ---------
  if (postbackData.action === "confirm") {
    const rawData = postbackData.customerData;
    if (!rawData || !rawData.name) {
      return client.pushMessage(event.source.userId, {
        type: "text",
        text: "❌ ข้อมูลลูกค้าไม่ครบ",
      });
    }

    const customerData = {
      ...rawData,
      quantity: rawData.quantity ? Number(rawData.quantity) : 0,
      name: rawData.name || "",
      phone: rawData.phone || "",
      address: rawData.address || "",
      ac_type: rawData.ac_type || "ธรรมดา",
      clean_type: rawData.clean_type || "ล้างปกติ",
      appointment_date: rawData.appointment_date || "",
      appointment_time: rawData.appointment_time || "",
      status: rawData.status || "รอดำเนินการ",
    };

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

  // --------- Confirm Update Customer ---------
  if (postbackData.action === "confirm_update") {
    const { customerId, newData: rawNewData } = postbackData;

    if (!customerId || !rawNewData) {
      return client.pushMessage(event.source.userId, {
        type: "text",
        text: "❌ ข้อมูลสำหรับอัปเดตไม่ครบ กรุณาลองใหม่อีกครั้ง",
      });
    }

    // ดึงข้อมูลเก่าจาก DB
    const oldData = await getCustomerById(customerId);
    if (!oldData) {
      return client.pushMessage(event.source.userId, {
        type: "text",
        text: "❌ ไม่พบลูกค้าในระบบ กรุณาลองใหม่อีกครั้ง",
      });
    }

    // สร้าง newData โดย fallback ไปใช้ค่าเก่าเมื่อผู้ใช้ไม่กรอก
    const newData = {
      ...oldData.toObject(),
      ...rawNewData,
      quantity: rawNewData.quantity
        ? Number(rawNewData.quantity)
        : oldData.quantity,
      name: rawNewData.name || oldData.name,
      phone: rawNewData.phone || oldData.phone,
      address: rawNewData.address || oldData.address,
      ac_type: rawNewData.ac_type || oldData.ac_type,
      clean_type: rawNewData.clean_type || oldData.clean_type,
      appointment_date: rawNewData.appointment_date || oldData.appointment_date,
      appointment_time: rawNewData.appointment_time || oldData.appointment_time,
      status: rawNewData.status || oldData.status,
    };

    await client.pushMessage(event.source.userId, {
      type: "text",
      text: "⏳ กำลังอัปเดตข้อมูลลูกค้า...",
    });

    try {
      const updatedCustomer = await updateCustomerByNameAndDate(
        oldData.name,
        oldData.appointment_date,
        newData
      );

      if (!updatedCustomer) {
        return client.pushMessage(event.source.userId, {
          type: "text",
          text: `❌ ไม่สามารถอัปเดตข้อมูลลูกค้าได้`,
        });
      }

      // ส่งข้อความยืนยัน + flex summary
      const flexMessage = buildFlexUpdateConfirmation(oldData, newData);
      return client.pushMessage(event.source.userId, [
        { type: "text", text: "✅ อัปเดตข้อมูลลูกค้าเรียบร้อยแล้ว" },
      ]);
    } catch (err) {
      console.error("Error updating customer:", err);
      return client.pushMessage(event.source.userId, {
        type: "text",
        text: "❌ เกิดข้อผิดพลาดในการอัปเดตข้อมูลลูกค้า",
      });
    }
  }

  // --------- Cancel ---------
  if (postbackData.action === "cancel") {
    return client.pushMessage(event.source.userId, {
      type: "text",
      text: "❌ ยกเลิกการดำเนินการ",
    });
  }

  return Promise.resolve(null);
};
