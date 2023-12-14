const mongoose = require("mongoose");

const priceHistorySchema = new mongoose.Schema({
  product_name: {
    type: String,
  },
  country: {
    type: String,
  },
  price: {
    type: String,
  },
  createdAt: {
    type: String,
  },
  currency: {
    type: String,
  },
});

module.exports = mongoose.model("PriceHistory", priceHistorySchema);
