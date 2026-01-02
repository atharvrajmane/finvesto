import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
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

  // Fetch watchlist (single source of truth)
  const getWatchList = async () => {
    try {
      const response = await apiClient.get("/watchlist");

      // ✅ FIX: unwrap standardized backend response
      const list = response?.data?.data || [];

      setWatchList(list);
    } catch (error) {
      console.error("Failed to fetch watchlist:", error);
      setWatchList([]); // safety fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getWatchList();
  }, []);

  // Add stock to watchlist
  const handleSelectedStock = async (e) => {
    const stockSymbol = e.target.value;
    if (!stockSymbol) return;

    setAddedStock(stockSymbol);

    try {
      await apiClient.post("/watchlist", { stockName: stockSymbol });
      getWatchList();
    } catch (error) {
      console.error("Failed to add stock to watchlist:", error);
    }
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
                <MenuItem key={uuidv4()} value={currStock.stockSymbol}>
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
          <div key={stock._id || uuidv4()}>
            <WatchListComponent
              stock={stock}
              refreshWatchlist={getWatchList}
            />
            <hr />
          </div>
        ))}
    </div>
  );
}
