import { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import LinearProgress from "@mui/material/LinearProgress";
import WatchListComponent from "./WatchListComponent.jsx";
import { stocks } from "../../../utils/stocks.js";
import apiClient from "../../api/apiClient";

export default function WatchList() {
  const [watchList, setWatchList] = useState([]);
  const [addedStock, setAddedStock] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getWatchList = useCallback(async () => {
    try {
      const response = await apiClient.get("/watchlist");
      setWatchList(response?.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch watchlist:", err);
      setWatchList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getWatchList();
  }, []);

  const handleSelectedStock = async (e) => {
    const stockSymbol = e.target.value;
  
    if (watchList.some(s => s.stockSymbol === stockSymbol)) {
      console.warn("Stock already in watchlist");
      return;
    }
  
    setAddedStock(stockSymbol);
  
    await apiClient.post("/watchlist", { stockName: stockSymbol });
    getWatchList();
  };
  

  return (
    <div className="container-fluid">
      <div className="d-flex p-3 border-bottom ">
        <Box sx={{ width: "100%" }}>
          <FormControl fullWidth>
            <InputLabel id="add-stock-select-label">Add Stock</InputLabel>
            <Select
              labelId="add-stock-select-label"
              id="add-stock-select"
              value={addedStock}
              label="Add Stock"
              onChange={handleSelectedStock}
            >
              {stocks.map((currStock) => (
                <MenuItem
                  key={currStock.stockSymbol}
                  value={currStock.stockSymbol}
                >
                  {currStock.stockName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </div>

      {isLoading && <LinearProgress />}

      {!isLoading &&
        watchList.map((stock) => (
          <div key={`${stock._id}-${stock.stockSymbol}`}>
            <WatchListComponent stock={stock} refreshWatchlist={getWatchList} />
            <hr />
          </div>
        ))}
    </div>
  );
}
