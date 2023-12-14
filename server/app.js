const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(cookieParser());

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "server/config/.env",
  });
}

// // import routes
const priceHistoryController = require("./controller/priceHistory");

app.use("/api/v2", priceHistoryController);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
