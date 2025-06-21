const axios = require("axios");

async function addCustomerRecord(data) {
  try {
    const response = await axios.post(process.env.SHEETDB_API_URL, {
      data,
    });
    return response.data;
  } catch (error) {
    console.error("SheetDB error:", error.message);
    throw error;
  }
}

module.exports = { addCustomerRecord };
