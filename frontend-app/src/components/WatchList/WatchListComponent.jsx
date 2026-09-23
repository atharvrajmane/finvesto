import { useState } from "react";
import "./WatchListComponent.css";
import WatchListPrice from "./WatchListPrice";
import WatchListActions from "./WatchListActions";

export default function WatchListComponent({ stock, refreshWatchlist }) {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  // Access the nested stock data
  const stockDetails = stock.stockId || {}; 
  const displayName = stockDetails.symbol || "UNKNOWN";
  
  return (
    <div
      data-testid="watchlist-item"
      onMouseEnter={() => setShowWatchlistActions(true)}
      onMouseLeave={() => setShowWatchlistActions(false)}
      style={{ transition: "background-color 0.2s", cursor: "pointer" }}
    >
      <div className="d-flex align-items-center justify-content-between p-3">
        <div className="fw-bold text-dark">
          {displayName}
        </div>

        {showWatchlistActions ? (
          <WatchListActions
            stock={{ ...stockDetails, _id: stock.stockId._id }} // Pass nested data
            refreshWatchlist={refreshWatchlist}
            setFalse={() => setShowWatchlistActions(false)}
          />
        ) : (
          <WatchListPrice stock={stockDetails} />
        )}
      </div>
    </div>
  );
}