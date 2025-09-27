const handleSearchByDate = require("./commands/command.searchByDate");
const handleSearchByName = require("./commands/command.searchByName");
const handleShowAllCustomers = require("./commands/command.showAll");
const handleNewCustomer = require("./commands/command.newCustomer");
const handleUpdateCustomer = require("./commands/command.updateCustomer");

module.exports = async function handleMessage(event, client) {
  const userText = event.message.text.trim();

  if (userText === "ดูข้อมูลลูกค้า") {
    return handleShowAllCustomers(client, event.replyToken);
  }

  const dateMatch = userText.match(
    /^ดูข้อมูลลูกค้าวันที่\s+(\d{1,2}\/\d{1,2}\/\d{4})$/
  );
  if (dateMatch)
    return handleSearchByDate(client, event.replyToken, dateMatch[1]);

  if (/^ดูข้อมูลลูกค้าชื่อ\s+.+/.test(userText)) {
    const name = userText.replace(/^ดูข้อมูลลูกค้าชื่อ\s+/, "").trim();
    return handleSearchByName(client, event.replyToken, name);
  }

  if (/^(อัพเดทข้อมูลลูกค้า|แก้ไขลูกค้า)/.test(userText)) {
    return handleUpdateCustomer(client, event.replyToken, userText);
  }

  return handleNewCustomer(client, event.replyToken, userText);
};
