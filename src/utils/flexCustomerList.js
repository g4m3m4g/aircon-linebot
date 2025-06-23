function buildCustomerListFlex(customers) {
  const customerContents = customers.slice(0, 5).map((c, i) => ({
    type: "box",
    layout: "vertical",
    margin: "md",
    spacing: "xs",
    contents: [
      {
        type: "text",
        text: `#${i + 1} ${c.name}`,
        weight: "bold",
        size: "md",
        color: "#333333"
      },
      {
        type: "text",
        text: `📍 ${c.address}`,
        wrap: true,
        size: "sm",
        color: "#666666"
      },
      {
        type: "text",
        text: `📞 ${c.phone} | แอร์: ${c.ac_type}, ล้าง: ${c.clean_type}, ${c.quantity} ตัว`,
        wrap: true,
        size: "sm",
        color: "#666666"
      },
      {
        type: "text",
        text: `🗓️ ${c.appointment_date}     ⏰ ${c.appointment_time}`,
        wrap: true,
        size: "sm",
        color: "#666666"
      },
      {
        type: "text",
        text: `สถานะ: ${c.status}`,
        size: "sm",
        color: "#888888"
      }
    ]
  }));

  return {
    type: "flex",
    altText: "ข้อมูลลูกค้าทั้งหมด",
    contents: {
      type: "carousel",
      contents: customerContents.map(content => ({
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          contents: [content]
        }
      }))
    }
  };
}

module.exports = { buildCustomerListFlex };
