const express = require("express");
const router = express.Router();
const PriceHistory = require("../model/priceHistory");
const axios = require("axios");

router.get("/price-history", async (req, res) => {
  const { itemName, country } = req.query;

  try {
    const d = {
      itemName,
      country,
    };

    // // Fetch amazon price history from API
    const result = await fetchRealTimeAmazonData(d);
    const products = result.data.products;
    const dateCreated = new Date().toLocaleDateString("en-GB");

    // // Extract and store relevant data in MongoDB
    for (const product of products) {
      const { currency, product_title, product_price } = product;

      newPrice = String(product_price).substring(1);

      const newPriceHistory = new PriceHistory({
        country: country,
        currency: currency,
        product_name: product_title,
        price: newPrice,
        createdAt: dateCreated,
      });
      // Save to MongoDB
      await newPriceHistory.save();
    }

    // Retrieve data from MongoDB based on itemName and country
    const retrievedData = await retrievePriceHistoryFromMongoDB(
      itemName,
      country
    );

    res.status(200).json({
      message: "Data saved and retrieved successfully",
      data: retrievedData,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch amazon price history from API
async function fetchRealTimeAmazonData(v) {
  // console.log(v, "V DATA NEW");
  const { itemName, country } = v;

  const options = {
    headers: {
      "X-RapidAPI-Key": "68f1d988f6mshdd52c3e46e1dc6fp1d1c56jsn519f590b910d",
      "X-RapidAPI-Host": "real-time-amazon-data.p.rapidapi.com",
    },
    params: {
      query: `${itemName}`,
      country: `${country}`,
      category_id: "aps",
    },
  };

  // console.log(options, "Option");

  try {
    // Call real time amazon data API
    const realTimeAmazonData = await axios.get(
      "https://real-time-amazon-data.p.rapidapi.com/search",
      options
    );

    return realTimeAmazonData.data;
    
  } catch (error) {
    console.error(error);
    throw new Error("Error in Fetch Realtime Amazon Data function");
  }
}

// Fetch price history from Database
async function retrievePriceHistoryFromMongoDB(itemName, country) {
  try {
    const query = {
      product_name: itemName,
      country: country,
    };

    // Assuming you want to find documents based on the product_name and country
    const priceHistoryData = await PriceHistory.find({
      product_name: { $regex: itemName, $options: "i" },
      // country: country,
    });
    // console.log(priceHistoryData, "Price HISTORY DATA");
    return priceHistoryData;
  } catch (error) {
    console.error("Error retrieving data from MongoDB:", error);
    throw new Error("Error in retrievePriceHistoryFromMongoDB function");
  }
}

module.exports = router;
