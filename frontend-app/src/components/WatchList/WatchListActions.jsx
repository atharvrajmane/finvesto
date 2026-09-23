import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import NewBuyButton from "./BuyButton/NewBuyButton.jsx";
import apiClient from "../../api/apiClient";
import NewSellButton from "./SellButton/NewSellButton.jsx";

export default function WatchListActions({ stock, refreshWatchlist }) {
  let handleDelete = async (e) => {
    try {
      await apiClient.delete(`/watchlist/${stock._id}`);
      refreshWatchlist();
    } catch (error) {
      console.error("Failed to delete stock:", error);
    }
  };

  return (
    <div>
      <Stack spacing={1} direction="row">
        <Tooltip title="Buy" arrow placement="top" disableInteractive>
          <span>
            <NewBuyButton stock={stock} />
          </span>
        </Tooltip>

        <Tooltip title="Sell" arrow placement="top" disableInteractive>
          <span>
            <NewSellButton stock={stock} />
          </span>
        </Tooltip>

        <Tooltip title="Delete" arrow placement="top" disableInteractive>
          <Button
            onClick={handleDelete}
            variant="contained"
            size="small"
            sx={{
              background: "linear-gradient(to bottom right, #30209B, #24BEEB)",
              color: "white",
              minWidth: "40px",
              padding: "4px 8px",
            }}
          >
            <DeleteIcon fontSize="small" />
          </Button>
        </Tooltip>
      </Stack>
    </div>
  );
}
