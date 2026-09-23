import { useEffect, useState, useCallback } from "react";
import { Box, InputLabel, MenuItem, FormControl, Select, LinearProgress } from "@mui/material";
import WatchListComponent from "./WatchListComponent.jsx";
import apiClient from "../../api/apiClient";

export default function WatchList() {
  const [watchList, setWatchList] = useState([]);
  const [availableStocks, setAvailableStocks] = useState([]);
  const [addedStock, setAddedStock] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchAvailableStocks = async () => {
    try {
      const res = await apiClient.get("/stocks");
      setAvailableStocks(res?.data?.data || res?.data || []);
    } catch (err) {
      console.error("Failed to load stocks market:", err);
    }
  };

  const getWatchList = useCallback(async () => {
    try {
      const response = await apiClient.get("/watchlist");
      setWatchList(response?.data?.data || response?.data || []);
    } catch (err) {
      console.error("Failed to fetch watchlist:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailableStocks();
    getWatchList();
    const interval = setInterval(() => getWatchList(), 5000);
    return () => clearInterval(interval);
  }, [getWatchList]);

  const handleSelectedStock = async (e) => {
    const stockId = e.target.value;
    if (watchList.some(s => s.stockId?._id === stockId || s.stockId?.symbol === stockId)) return;
    
    setAddedStock(stockId);
    try {
      await apiClient.post("/watchlist", { stockId: stockId });
      getWatchList();
    } catch (err) {
      console.error("Failed to add stock", err);
    }
    setAddedStock("");
  };

  return (
    <div className="container-fluid">
      <div className="d-flex p-3 border-bottom">
        <Box sx={{ width: "100%" }}>
          <FormControl fullWidth>
            <InputLabel id="add-stock-select-label">Add Stock</InputLabel>
            <Select
              labelId="add-stock-select-label"
              value={addedStock}
              label="Add Stock"
              onChange={handleSelectedStock}
            >
              {availableStocks.map((stock) => (
                <MenuItem key={stock._id} value={stock._id}>
                  {stock.name || stock.symbol}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </div>

      {isLoading && <LinearProgress />}

      {!isLoading && watchList.length === 0 && (
        <div className="text-center text-muted p-4">Your watchlist is empty.</div>
      )}
      
      {!isLoading && watchList.map((stock) => (
        <div key={stock._id}>
          <WatchListComponent stock={stock} refreshWatchlist={getWatchList} />
          <hr />
        </div>
      ))}
    </div>
  );
}