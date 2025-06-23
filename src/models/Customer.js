const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    address: String,
    ac_type: String,
    clean_type: String,
    quantity: Number,
    appointment_date: String,
    appointment_time: String,
    status: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
