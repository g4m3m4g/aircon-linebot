// นำเข้าไลบรารีที่จำเป็น
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

// อ่าน Prompt Template จากไฟล์ (ส่วนนี้เหมือนเดิม)
const promptTemplate = fs.readFileSync(
  path.join(__dirname, "../prompts/extractCustomerPrompt.txt"),
  "utf-8"
);

require("dotenv").config(); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function getTodayDateThaiFormat() {
  const today = new Date();
  const date = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear() + 543;
  const fullTodayDate = `${date}/${month}/${year}`;
  return fullTodayDate;
}


async function parseCustomerData(text) {
  const today = getTodayDateThaiFormat();
  const finalPrompt = promptTemplate
    .replace("{today}", today)
    .replace("{input}", text);

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(finalPrompt);
    const response = result.response;
    
    const rawText = response.text();

    const json = JSON.parse(rawText);

    return json;
  } catch (error) {
    console.error("LLM parse error:", error);
    return null;
  }
}

module.exports = { parseCustomerData };