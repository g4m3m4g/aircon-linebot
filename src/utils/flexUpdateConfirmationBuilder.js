function buildFlexUpdateConfirmation(oldData = {}, newData = {}) {
  const safe = (val) => (val !== null && val !== undefined ? String(val) : "");

  return {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      spacing: "sm",
      contents: [
        {
          type: "text",
          text: "📌 ยืนยันการอัปเดตลูกค้า",
          weight: "bold",
          size: "lg",
          wrap: true,
        },
        {
          type: "text",
          text: `ชื่อลูกค้า: ${safe(oldData.name)} → ${safe(newData.name)}`,
          wrap: true,
        },
        {
          type: "text",
          text: `ที่อยู่: ${safe(oldData.address)} → ${safe(newData.address)}`,
          wrap: true,
        },
        {
          type: "text",
          text: `เบอร์: ${safe(oldData.phone)} → ${safe(newData.phone)}`,
          wrap: true,
        },
        {
          type: "text",
          text: `แอร์: ${safe(oldData.ac_type)} → ${safe(newData.ac_type)}`,
          wrap: true,
        },
        {
          type: "text",
          text: `ล้าง: ${safe(oldData.clean_type)} → ${safe(
            newData.clean_type
          )}`,
          wrap: true,
        },
        {
          type: "text",
          text: `จำนวน: ${safe(oldData.quantity)} → ${safe(newData.quantity)}`,
          wrap: true,
        },
        {
          type: "text",
          text: `วันที่: ${safe(oldData.appointment_date)} → ${safe(
            newData.appointment_date
          )}`,
          wrap: true,
        },
        {
          type: "text",
          text: `เวลา: ${safe(oldData.appointment_time)} → ${safe(
            newData.appointment_time
          )}`,
          wrap: true,
        },
        {
          type: "text",
          text: `สถานะ: ${safe(oldData.status)} → ${safe(newData.status)}`,
          wrap: true,
        },
      ],
    },
    footer: {
      type: "box",
      layout: "horizontal",
      spacing: "sm",
      contents: [
        {
          type: "button",
          style: "primary",
          color: "#1DB446",
          action: {
            type: "postback",
            label: "👌 ยืนยัน",
            data: JSON.stringify({
              action: "confirm_update",
              customerId: oldData._id,
              newData,
            }),
          },
        },
        {
          type: "button",
          style: "secondary",
          action: {
            type: "postback",
            label: "❌ ยกเลิก",
            data: JSON.stringify({ action: "cancel" }),
          },
        },
      ],
    },
  };
}

module.exports = { buildFlexUpdateConfirmation };
