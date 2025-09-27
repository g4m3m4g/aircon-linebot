const handleSearchByDate = require("./commands/command.searchByDate");
const handleSearchByName = require("./commands/command.searchByName");
const handleShowAllCustomers = require("./commands/command.showAll");
const handleNewCustomer = require("./commands/command.newCustomer");
const handleUpdateCustomer = require("./commands/command.updateCustomer");

module.exports = async function handleMessage(event, client) {
  const userText = event.message.text.trim();

  // --- ดูข้อมูลลูกค้าทั้งหมด ---
  if (/ดู(ข้อมูล)?ลูกค้า$/i.test(userText)) {
    return handleShowAllCustomers(client, event.replyToken);
  }

  // --- ดูข้อมูลลูกค้าตามวัน ---
  const dateMatch = userText.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
  if (/ดู(ข้อมูล)?ลูกค้า/i.test(userText) && dateMatch) {
    return handleSearchByDate(client, event.replyToken, dateMatch[1]);
  }

  // --- ดูข้อมูลลูกค้าตามชื่อ ---
  const nameMatch = userText.match(/ลูกค้า(?:ชื่อ)?\s*(.+)/i);
  if (/ดู(ข้อมูล)?ลูกค้า/i.test(userText) && nameMatch) {
    return handleSearchByName(client, event.replyToken, nameMatch[1].trim());
  }

  // --- อัพเดทข้อมูลลูกค้า ---
  if (/อัพเดท|แก้ไข/i.test(userText)) {
    return handleUpdateCustomer(client, event.replyToken, userText);
  }

  // --- เพิ่มลูกค้าใหม่ (default fallback) ---
  return handleNewCustomer(client, event.replyToken, userText);
};
