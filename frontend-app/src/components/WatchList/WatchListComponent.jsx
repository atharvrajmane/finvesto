import { useEffect, useState } from "react";
import "./WatchListComponent.css";
import WatchListPrice from "./WatchListPrice";
import WatchListActions from "./WatchListActions";
import { getLtp } from "../../../utils/GetLtp.js";
import apiClient from "../../api/apiClient"; 

export default function WatchListComponent({ stock, refreshWatchlist }) {
  const [stockData, setStockData] = useState({});

  //Update stock LTP Continiously
  useEffect(() => {
    const interval = setInterval(() => { // Gave the interval a variable name for potential cleanup
      async function updateHoldings() {
        // 2. CHANGED: Use apiClient for the GET request
        let responses = await apiClient.get("/holdings");
        responses = responses.data;
        if (responses) {
          for (let response of responses) {
            let newData = getLtp(response.name);
            // 3. CHANGED: Use apiClient for the POST request
            await apiClient.post("/holdings/update", {
              name: response.name,
              price: newData.randomNumber,
              net: String(newData.percentageDifference + "%"),
            });
          }
        }
      }
      updateHoldings();
      if (stock.stockName) {
        setStockData(getLtp(stock.stockName));
      }
    }, 2500);

    // This cleanup is highly recommended to prevent memory leaks
    return () => clearInterval(interval);
    
  }, []);

  let [showWatchlistActions, setShowWatchlistActions] = useState(false);
  let handleMouseEnter = (e) => {
    setShowWatchlistActions(true);
  };
  let handleMouseExit = (e) => {
    setShowWatchlistActions(false);
  };
  return (
    <div
      className="container-fluid mt-3"
      onMouseOver={handleMouseEnter}
      onMouseOut={handleMouseExit}
    >
      <div className="d-flex align-items-center justify-content-between">
        <div className={stockData && stockData.isDown ? "red" : "green"}>
          {stockData?.stockSymbol || "Loading..."}
        </div>
        {stockData?.stockSymbol ? (
          showWatchlistActions ? (
            <WatchListActions
              stock={stockData}
              refreshWatchlist={refreshWatchlist}
              setFalse={handleMouseExit}
            />
          ) : (
            <WatchListPrice stock={stockData} />
          )
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}