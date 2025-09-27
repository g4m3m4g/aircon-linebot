const Customer = require("../models/Customer");

async function addCustomerRecordToMongo(data) {
  const customer = new Customer(data);
  await customer.save();
  console.log("✅ Customer saved to MongoDB");
}

async function getAllCustomers() {
  return await Customer.find().sort({ createdAt: -1 });
}

async function getCustomerById(id) {
  return await Customer.findById(id);
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
    name: { $regex: name, $options: "i" },
  }).sort({ appointment_date: 1, appointment_time: 1 });
}

async function getCustomersByNameAndDate(name, date) {
  return await Customer.findOne({
    name: { $regex: `^${name}$`, $options: "i" },
    appointment_date: date,
  });
}

async function updateCustomerByNameAndDate(name, appointment_date, newData) {
  const oldCustomer = await Customer.findOne({ name, appointment_date });
  if (!oldCustomer) return null;

  const mergedData = {
    phone: newData.phone || oldCustomer.phone,
    address: newData.address || oldCustomer.address,
    ac_type: newData.ac_type || oldCustomer.ac_type,
    clean_type: newData.clean_type || oldCustomer.clean_type,
    quantity: newData.quantity ?? oldCustomer.quantity,
    appointment_time: newData.appointment_time || oldCustomer.appointment_time,
    status: newData.status || oldCustomer.status,
  };

  const updatedCustomer = await Customer.findByIdAndUpdate(
    oldCustomer._id,
    mergedData,
    { new: true }
  );

  return updatedCustomer;
}

module.exports = {
  addCustomerRecordToMongo,
  getAllCustomers,
  getCustomerById,
  getCustomersByAppointmentDate,
  getCustomersByName,
  getAllBookingsDateAndTime,
  getCustomersByNameAndDate,
  updateCustomerByNameAndDate,
};
