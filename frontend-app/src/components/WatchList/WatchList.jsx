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

// 1. Import our new apiClient instead of the default axios
import apiClient from "../../api/apiClient"; // <-- Make sure this path is correct for your project structure

export default function WatchList() {
  const [watchList, setWatchList] = useState([]);
  const [addedStock, setAddedStock] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // A single, reliable function to fetch the watchlist from the server
  const getWatchList = async () => {
    try {
      // Use our authenticated apiClient to make the request
      const response = await apiClient.get("/watchlist");
      setWatchList(response.data);
    } catch (error) {
      console.error("Failed to fetch watchlist:", error);
      // You could set an error state here to show a message to the user
    } finally {
      setIsLoading(false);
    }
  };

  // This effect runs only once when the component is first loaded
  useEffect(() => {
    getWatchList();
  }, []);

  // This function handles adding a new stock when selected from the dropdown
  const handleSelectedStock = async (e) => {
    const stockSymbol = e.target.value;
    if (!stockSymbol) return;

    // Set the state for the dropdown immediately for a responsive UI
    setAddedStock(stockSymbol);

    try {
      const sendData = { stockName: stockSymbol };
      // Use our authenticated apiClient to send the new stock to the server
      await apiClient.post("/watchlist", sendData);

      // After a successful post, call our single source of truth to refresh the list
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

      {/* Show a loading bar only when initially fetching data */}
      {isLoading && <LinearProgress />}

      {/* Map over the watchlist data to display each stock */}
      {!isLoading && watchList.map((stock) => (
        // Using stock._id from MongoDB is a more stable key than uuidv4 for existing data
        <div key={stock._id || uuidv4()}>
          <WatchListComponent
            stock={stock}
            // Pass down a function to allow the child component to refresh the list
            // This is useful if you add a "delete" button inside WatchListComponent
            refreshWatchlist={getWatchList}
          />
          <hr />
        </div>
      ))}
    </div>
  );
}