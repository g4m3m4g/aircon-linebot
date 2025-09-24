// create GET medthod for export data from mongoDB
const express = require("express");
const router = express.Router();
const { getAllBookingsDateAndTime } = require("../services/customerService");

router.get("/bookings", async (req, res) => {
  try {
    const customers = await getAllBookingsDateAndTime();
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

module.exports = router;
