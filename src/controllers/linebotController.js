const line = require("@line/bot-sdk");
const lineConfig = require("../config/lineConfig");
const { addCustomerRecord } = require("../services/sheetdbService");
const { parseCustomerData } = require("../services/llmService");

const client = new line.Client(lineConfig);
async function webhookHandler(req, res) {
  const events = req.body.events;

  try {
    await Promise.all(events.map(handleEvent));
    res.status(200).send("OK");
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
}

async function handleEvent(event) {
  if (event.type === "message" && event.message.type === "text") {
    const userText = event.message.text;
    // Parse customer data with LLM
    const customerData = await parseCustomerData(userText);
    if (!customerData) {
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "ขออภัย ไม่สามารถเข้าใจข้อมูลลูกค้าได้ กรุณาตรวจสอบอีกครั้ง",
      });
    }
    console.log(customerData);

    const confirmationText =
      `ชื่อลูกค้า: ${customerData.name}\n` +
      `ที่อยู่: ${customerData.address}\n` +
      `เบอร์โทร: ${customerData.phone}\n` +
      `ประเภทแอร์: ${customerData.ac_type}\n` +
      `ประเภทล้าง: ${customerData.clean_type}\n` +
      `จำนวน: ${customerData.quantity}\n` +
      `วันที่: ${customerData.appointment_date}\n` +
      `เวลา: ${customerData.appointment_time}\n` +
      `สถานะ: ${customerData.status}`;

    // V1: Confirmation message (template version)
    /*
    await client.replyMessage(event.replyToken, {
      type: "template",
      altText: "Please confirm customer info",
      template: {
        type: "confirm",
        text: `กรุณายืนยันข้อมูลลูกค้า\n\n${confirmationText}`,
        actions: [
          {
            type: "postback",
            label: "ยืนยัน",
            data: JSON.stringify({ action: "confirm", customerData }),
          },
          {
            type: "postback",
            label: "ยกเลิก",
            data: JSON.stringify({ action: "cancel" }),
          },
        ],
      },
    });*/

    // V2: Confirmation message (flex version)
    await client.replyMessage(event.replyToken, {
      type: "flex",
      altText: "Confirm Customer Info",
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "ยืนยันข้อมูลลูกค้า",
              weight: "bold",
              size: "lg",
            },
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
                {
                  type: "text",
                  text: `วันที่: ${customerData.appointment_date}`,
                },
                {
                  type: "text",
                  text: `เวลา: ${customerData.appointment_time}`,
                },
              ],
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
        },
      },
    });
  }

  // Waiting for user confirmation
  if (event.type === "postback") {
    let postbackData;
    try {
      postbackData = JSON.parse(event.postback.data);
    } catch (err) {
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "ไม่สามารถอ่านข้อมูลได้",
      });
    }

    // If confirmed
    if (postbackData.action === "confirm") {
      const customerData = postbackData.customerData;

      // Send message to user before adding to db
      await client.replyMessage(event.replyToken, {
        type: "text",
        text: "⏳ กำลังบันทึกข้อมูลลูกค้า...",
      });

      // Add customer data to db
      try {
        await addCustomerRecord(customerData);
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

    // If canceled
    if (postbackData.action === "cancel") {
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "❌ ยกเลิกการบันทึกข้อมูลแล้ว",
      });
    }
  }

  return Promise.resolve(null);
}

module.exports = { webhookHandler };
