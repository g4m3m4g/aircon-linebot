function buildCustomerListFlex(customers) {
  const bubbles = customers.slice(0, 10).map((c, i) => ({
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      spacing: "md",
      paddingAll: "20px",
      contents: [
        {
          type: "text",
          text: `🧾 รายการลูกค้า #${i + 1}`,
          size: "lg",
          weight: "bold",
          color: "#1DB446",
        },
        divider(),
        textRow("👤 ชื่อ", c.name),
        textRow("📍 ที่อยู่", c.address),
        textRow("📞 เบอร์", c.phone),
        textRow("❄️ ประเภทแอร์", c.ac_type),
        textRow("🧼 ประเภทล้าง", c.clean_type),
        textRow("🔢 จำนวน", `${c.quantity} ตัว`),
        textRow("📅 วันที่", c.appointment_date),
        textRow("⏰ เวลา", c.appointment_time),
        textRow("📌 สถานะ", c.status),
      ],
    },
  }));

  return {
    type: "flex",
    altText: "ข้อมูลลูกค้าทั้งหมด",
    contents: {
      type: "carousel",
      contents: bubbles,
    },
  };
}

function textRow(label, value) {
  return {
    type: "box",
    layout: "horizontal",
    spacing: "sm",
    contents: [
      {
        type: "text",
        text: label,
        size: "sm",
        color: "#555555",
        flex: 4,
        wrap: true,
      },
      {
        type: "text",
        text: value || "-",
        size: "sm",
        color: "#111111",
        wrap: true,
        flex: 7,
      },
    ],
  };
}

function divider() {
  return {
    type: "separator",
    margin: "md",
  };
}

module.exports = { buildCustomerListFlex };
