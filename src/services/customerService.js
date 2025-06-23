const Customer = require("../models/Customer");

async function addCustomerRecordToMongo(data) {
  const customer = new Customer(data);
  await customer.save();
  console.log("✅ Customer saved to MongoDB");
}

async function getAllCustomers() {
  return await Customer.find().sort({ createdAt: -1 });
}

module.exports = { addCustomerRecordToMongo, getAllCustomers };
