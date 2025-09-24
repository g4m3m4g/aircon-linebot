require("dotenv").config();
const express = require("express");
const lineRoutes = require("./routes/linebotRoute");
const exportRoutes = require("./routes/exportRoute");
const connectMongo = require("./services/mongoService");

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api/line", lineRoutes);
app.use(express.json());
app.get("/", (req, res) => {
  res.send("✅ AIRCON LINE Bot is running");
});
app.use("/api", exportRoutes);

// Connect to MongoDB and start server
connectMongo()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1); // Stop app if DB connection fails
  });
