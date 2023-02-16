// Define the name and path of the text file
const filename = "crypto_tax.txt";

// Define an object to store the FIFO trading history for each coin
const tradingHistory = {};

const { log } = require("console");
// Read the data from the text file
const fs = require("fs");
fs.readFile(filename, "utf8", function (err, data) {
  if (err) throw err;

  // Split the text file data into an array of trades gg, trim=เอาพท สีขาวออก
  const trades = data.trim().split("\n");
  //console.log(data);
  //console.log(trades);

  // Loop through each trade
  let totalProfit = 0;
  for (let i = 0; i < trades.length; i++) {
    const [type, coin, price, quantity] = trades[i].split(" ");
    // console.log([type, coin, price, quantity]);
    // console.log(trades[i]);

    // Update the trading history for the current coin
    if (!tradingHistory[coin]) {
      tradingHistory[coin] = [];
      console.log(tradingHistory[coin]);
    }
    if (type === "B") {
      tradingHistory[coin].push({
        type: "B",
        quantity: parseFloat(quantity),
        price: parseFloat(price),
      });
      console.log(tradingHistory[coin]);
    } else {
      let remainingQuantity = parseFloat(quantity);
      // console.log(remainingQuantity);
      while (remainingQuantity > 0) {
        const oldestBuy = tradingHistory[coin].find(
          (trade) => trade.type === "B"
        );
        // console.log(oldestBuy);
        if (!oldestBuy) {
          console.log(`Error: no previous buy trade found for ${coin}`);
          return;
        }
        const sellQuantity = Math.min(remainingQuantity, oldestBuy.quantity);
        // console.log(remainingQuantity);
        // console.log(oldestBuy.quantity+'\n');
        remainingQuantity = remainingQuantity - sellQuantity;
        // console.log(remainingQuantity);
        const profit = sellQuantity * (parseFloat(price) - oldestBuy.price);
        // console.log(profit);
        // console.log(`Sold ${sellQuantity} ${coin} at ${price} for a profit of ${profit}`);
        // console.log(sellQuantity);
        // console.log(oldestBuy.quantity);
        if (sellQuantity < oldestBuy.quantity) {
          oldestBuy.quantity -= sellQuantity;
          // console.log(oldestBuy.quantity);
        } else {
          tradingHistory[coin].shift();
        }
        totalProfit += profit;
      }
      tradingHistory[coin].push({
        type: "S",
        quantity: parseFloat(quantity),
        price: parseFloat(price),
      });
    }
  }
  console.log(`Total profit/loss for all coins: ${totalProfit}`);
});
