import { useEffect, useState } from "react";
import "./WatchListComponent.css";
import WatchListPrice from "./WatchListPrice";
import WatchListActions from "./WatchListActions";
import { getLtp } from "../../../utils/GetLtp.js";

export default function WatchListComponent({ stock, refreshWatchlist }) {
  const [stockData, setStockData] = useState(null);
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (stock?.stockName) {
        setStockData(getLtp(stock.stockName));
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [stock?.stockName]);

  return (
    <div
      className="container-fluid mt-3"
      onMouseEnter={() => setShowWatchlistActions(true)}
      onMouseLeave={() => setShowWatchlistActions(false)}
    >
      <div className="d-flex align-items-center justify-content-between">
        <div className={stockData?.isDown ? "red" : "green"}>
          {stockData?.stockSymbol || stock.stockName}
        </div>

        {showWatchlistActions ? (
          <WatchListActions
            stock={stockData || stock}
            refreshWatchlist={refreshWatchlist}
            setFalse={() => setShowWatchlistActions(false)}
          />
        ) : (
          <WatchListPrice stock={stockData || stock} />
        )}
      </div>
    </div>
  );
}
