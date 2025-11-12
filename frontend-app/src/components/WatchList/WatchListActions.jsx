import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import NewBuyButton from "./BuyButton/NewBuyButton.jsx";
// 1. CHANGED: Import our authenticated apiClient instead of the default axios
import apiClient from "../../api/apiClient"; // <-- MAKE SURE THIS PATH IS CORRECT
import NewSellButton from "./SellButton/NewSellButton.jsx";

// 2. CHANGED: Accept the refreshWatchlist function from the parent for cleaner code
export default function WatchListActions({ stock, refreshWatchlist }) {
  let handleDelete = async (e) => {
    try {
      // 3. CORRECTED METHOD & URL: Use apiClient.delete, which is the correct HTTP method.
      // For axios.delete, the data payload must be inside a `data` object.
      await apiClient.delete("/watchlist", {
        data: { stockName: stock.stockSymbol },
      });

      // 4. IMPROVED LOGIC: Call the refresh function passed from the parent.
      // This is cleaner than re-fetching the data here.
      refreshWatchlist();
    } catch (error) {
      console.error("Failed to delete stock:", error);
    }
  };

  return (
    <div>
      <Stack spacing={1} direction="row">
        <Tooltip title="Buy" arrow placement="top">
          <NewBuyButton stock={stock} />
        </Tooltip>
        <Tooltip title="Sell" arrow placement="top">
          <NewSellButton stock={stock} />
        </Tooltip>
        <Tooltip title="Delete" arrow placement="top">
          <Button
            onClick={handleDelete}
            variant="contained"
            size="small"
            style={{ backgroundColor: "rgb(242, 192, 126)" }}
          >
            <DeleteIcon />
          </Button>
        </Tooltip>
      </Stack>
    </div>
  );
}