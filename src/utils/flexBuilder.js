function buildFlexConfirmation(customerData) {
  return {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        { type: "text", text: "ยืนยันข้อมูลลูกค้า", weight: "bold", size: "lg" },
        {
          type: "box",
          layout: "vertical",
          margin: "md",
          spacing: "sm",
          contents: [
            { type: "text", text: `ชื่อ: ${customerData.name}` },
            { type: "text", text: `ที่อยู่: ${customerData.address}` },
            { type: "text", text: `เบอร์: ${customerData.phone}` },
            { type: "text", text: `แอร์: ${customerData.ac_type}` },
            { type: "text", text: `ล้าง: ${customerData.clean_type}` },
            { type: "text", text: `จำนวน: ${customerData.quantity}` },
            { type: "text", text: `วันที่: ${customerData.appointment_date}` },
            { type: "text", text: `เวลา: ${customerData.appointment_time}` },
          ]
        }
      ]
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
            data: JSON.stringify({ action: "confirm", customerData }),
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
    }
  };
}

module.exports = { buildFlexConfirmation };
