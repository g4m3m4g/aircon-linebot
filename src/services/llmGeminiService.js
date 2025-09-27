const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

// โหลด Prompt Template
const promptTemplate = fs.readFileSync(
  path.join(__dirname, "../prompts/extractCustomerPrompt.txt"),
  "utf-8"
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function getTodayDateThaiFormat() {
  const today = new Date();
  const date = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear() + 543;
  return `${date}/${month}/${year}`;
}

async function callModel(modelName, prompt) {
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent(prompt);
  const rawText = result.response.text();
  try {
    return JSON.parse(rawText);
  } catch (err) {
    console.error(`❌ JSON parse error from ${modelName}`);
    throw err;
  }
}

async function parseCustomerData(text) {
  const today = getTodayDateThaiFormat();
  const finalPrompt = promptTemplate
    .replace("{today}", today)
    .replace("{input}", text);

  const primaryModel = "gemini-2.5-flash";
  const fallbackModel = "gemini-2.5-flash-lite";

  try {
    console.log(`⚡ Using model: ${primaryModel}`);
    return await callModel(primaryModel, finalPrompt);
  } catch (error) {
    console.warn(
      `⚠️ Primary model failed (${primaryModel}), trying fallback...`,
      error.message
    );
    try {
      console.log(`🔄 Using fallback model: ${fallbackModel}`);
      return await callModel(fallbackModel, finalPrompt);
    } catch (fallbackError) {
      console.error(
        "❌ Both primary and fallback models failed:",
        fallbackError
      );
      return null;
    }
  }
}

module.exports = { parseCustomerData };
