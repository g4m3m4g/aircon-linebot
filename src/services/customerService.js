const Customer = require("../models/Customer");

async function addCustomerRecordToMongo(data) {
  const customer = new Customer(data);
  await customer.save();
  console.log("✅ Customer saved to MongoDB");
}

async function getAllCustomers() {
  return await Customer.find().sort({ createdAt: -1 });
}

async function getAllBookingsDateAndTime() {
  const result = await Customer.aggregate([
    {
      $group: {
        _id: "$appointment_date",
        times: { $addToSet: "$appointment_time" },
      },
    },
    {
      $project: {
        _id: 0,
        appointment_date: "$_id",
        appointment_times: "$times",
      },
    },
    {
      $sort: { appointment_date: 1 },
    },
  ]);

  return result;
}

async function getCustomersByAppointmentDate(date) {
  return await Customer.find({ appointment_date: date }).sort({
    appointment_time: 1,
  });
}

async function getCustomersByName(name) {
  return await Customer.find({
    name: { $regex: name, $options: "i" }, // case-insensitive partial match
  }).sort({ appointment_date: 1, appointment_time: 1 });
}

module.exports = {
  addCustomerRecordToMongo,
  getAllCustomers,
  getCustomersByAppointmentDate,
  getCustomersByName,
  getAllBookingsDateAndTime,
};
