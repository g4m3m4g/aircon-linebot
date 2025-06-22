const { Together } = require("together-ai");
const together = new Together();
const fs = require("fs");
const path = require("path");

const promptTemplate = fs.readFileSync(
  path.join(__dirname, "../prompts/extractCustomerPrompt.txt"),
  "utf-8"
);

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
  const finalPrompt = `Today date is ${today}.\n\n${promptTemplate.replace("{input}", text)}`;
  
  try {
    const response = await together.chat.completions.create({
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
      messages: [{ role: "user", content: finalPrompt }],
    });

    const rawText = response.choices[0].message.content.trim();
    const json = JSON.parse(rawText);
    
    return json;
  } catch (error) {
    console.error("LLM parse error:", error.message);
    return null;
  }
}

module.exports = { parseCustomerData };
