require("dotenv").config();
const express = require("express");
const lineRoutes = require("./routes/linebotRoute");

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api/line", lineRoutes);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("AIRCON LINE Bot is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
