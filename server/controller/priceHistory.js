const express = require("express");
const router = express.Router();
const PriceHistory = require("../model/priceHistory");
const axios = require("axios");
const { priceByDomain } = require("../helper/priceByDomain");

router.post("/price-history", async (req, res) => {
  try {
    const { itemName, country, source } = req.body;

    let result;

    if (source === "Amazon" || source === "Ebay") {
      result = await fetchPriceData(source, itemName, country);
      await saveToDatabase(result, country, source);
    }

    const retrievedData = await retrievePriceHistoryFromDatabase(
      itemName,
      country,
      source
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

async function saveToDatabase(products, country, source) {
  const dateCreated = new Date().toLocaleDateString("en-GB");

  const currencyObj = {
    US: "USD",
    UK: "GBP",
  };

  // console.log(products.search_results.length, "Products");

  const dataFromSource = {
    Amazon: products?.data?.products,
    Ebay: products?.search_results,
  };

  console.log(dataFromSource[source], "Data from source");

  const saveDbObj = {
    currency: currencyObj[country],
    createdAt: dateCreated,
    source: source,
    country: country,
  };

  const sortedData = dataFromSource[source]?.map((e) => {
    switch (source) {
      case "Amazon":
        return {
          ...saveDbObj,
          price: e?.product_price?.replace(/[\$,]/g, ""),
          product_name: e?.product_title,
        };
        break;
      case "Ebay":
        return {
          ...saveDbObj,
          price: e?.price?.value,
          product_name: e?.title,
        };
        break;
    }
  });

  const filterDataWithoutPrice = sortedData.filter(
    (e) => ![null, undefined].includes(e.price)
  );

  // Use insertMany for bulk insert and handle the promise
  PriceHistory.insertMany(filterDataWithoutPrice)
    .then((result) => {
      console.log(`Saved ${result.length} documents.`);
    })
    .catch((error) => {
      console.error(error);
    });
}

async function fetchPriceData(source, itemName, country) {
  const { apiUrl, requestOptions } = priceByDomain({
    source,
    itemName,
    country,
  });

  try {
    const response = await axios.get(apiUrl, requestOptions);

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Error in Fetch ${source} Price Data function`);
  }
}

async function retrievePriceHistoryFromDatabase(itemName, country, source) {
  try {
    const query = {
      product_name: { $regex: itemName, $options: "i" },
      country,
      source,
    };
    const priceHistoryData = await PriceHistory.find(query);

    console.log(priceHistoryData, "Price History Data");
    return priceHistoryData;
  } catch (error) {
    console.error("Error retrieving data from Database:", error);
    throw new Error("Error in Retrieve Price History from Database function");
  }
}

module.exports = router;
