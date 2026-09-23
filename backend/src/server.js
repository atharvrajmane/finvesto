require("dotenv").config();
require('./config/redis');
require('./jobs/marketDataWorker');

const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error(
    "CRITICAL ERROR: MONGO_URL is not defined in environment variables."
  );
  process.exit(1);
}

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB securely connected");

    app.listen(PORT, () => {
      console.log(`Finvesto Flagship Backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
