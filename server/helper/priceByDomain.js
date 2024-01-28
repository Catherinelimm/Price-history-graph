const priceByDomain = (payload) => {
    const { source, itemName, country } = payload;
  
    const apiUrl = {
      ebay: "https://api.countdownapi.com/request",
      amazon: "https://real-time-amazon-data.p.rapidapi.com/search",
    };
  
    const countryObj = {
      US: "ebay.com",
      UK: "ebay.co.uk",
    };
  
    switch (source) {
      case "Amazon":
        return {
          apiUrl: apiUrl["amazon"],
          requestOptions: {
            headers: {
              "X-RapidAPI-Key":
                "68f1d988f6mshdd52c3e46e1dc6fp1d1c56jsn519f590b910d",
              "X-RapidAPI-Host": "real-time-amazon-data.p.rapidapi.com",
            },
            params: {
              query: `${itemName}`,
              country: `${country}`,
              category_id: "aps",
            },
          },
        };
        break;
      case "Ebay":
        return {
          apiUrl: apiUrl["ebay"],
          requestOptions: {
            params: {
              api_key: "A4E778D08C9C4AD39525F963B7426328",
              ebay_domain: `${countryObj[country]}`,
              search_term: `${itemName}`,
              type: "search",
            },
          },
        };
        break;
      default:
        return null;
    }
  };
  
  exports.priceByDomain = priceByDomain;
  