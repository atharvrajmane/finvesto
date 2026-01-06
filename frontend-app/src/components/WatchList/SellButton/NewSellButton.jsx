import React, { useState, forwardRef } from "react";
import { Button, Snackbar, Modal, Box, CircularProgress } from "@mui/material";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import apiClient from "../../../api/apiClient";

const NewSellButton = forwardRef(({ stock }, ref) => {
  const [qty, setQty] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [errorType, setErrorType] = useState("success");
  const [availableQty, setAvailableQty] = useState(0);
  const [loading, setLoading] = useState(false);

  const price = Number(stock?.randomNumber);

  async function fetchAvailableQty() {
    try {
      const res = await apiClient.post("/holdings/quantity", {
        name: stock.stockSymbol ?? stock.name,
      });
      setAvailableQty(Number(res?.data?.data?.qty ?? 0));
    } catch (err) {
      console.error("fetchAvailableQty error:", err);
      setAvailableQty(0);
    }
  }

  async function executeSellOrder() {
    const payload = {
      orderType: "SELL",
      stockName: stock.stockSymbol ?? stock.name,
      qty: Number(qty),
      AveragePrice: price,
    };
    const res = await apiClient.post("/orders/sell", payload);
    return res?.data;
  }

  const handleQty = (e) => {
    const raw = e.target.value;

    if (raw === "") {
      setQty("");
      return;
    }

    if (!/^\d+$/.test(raw)) return;

    const numeric = Number(raw);
    if (numeric > 0 && numeric <= availableQty) {
      setQty(raw);
    }
  };

  const handleModalOpen = async () => {
    await fetchAvailableQty();
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setQty("");
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleButtonClick = async () => {
    const numericQty = Number(qty);

    if (!Number.isFinite(price) || price <= 0) {
      setMessage("Price not available");
      setErrorType("error");
      setSnackbarOpen(true);
      return;
    }

    if (!Number.isFinite(numericQty) || numericQty <= 0) {
      setMessage("Enter a valid quantity");
      setErrorType("error");
      setSnackbarOpen(true);
      return;
    }

    if (numericQty > availableQty) {
      setMessage("Insufficient quantity");
      setErrorType("error");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      const data = await executeSellOrder();
      if (data?.success) {
        setMessage(data.message || "Sell order placed successfully");
        setErrorType("success");
        setQty("");
      } else {
        setMessage(data?.message || "Sell order failed");
        setErrorType("error");
      }
    } catch (err) {
      setMessage(
        err?.response?.data?.message || err?.message || "Sell order failed"
      );
      setErrorType("error");
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
      handleModalClose();
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleModalOpen}
        style={{
          background: "linear-gradient(to bottom right, #30209B, #24BEEB)",
          color: "white",
          fontWeight: 600,
        }}
      >
        ➖ S
      </Button>

      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            width: 500,
            padding: 2,
            backgroundColor: "white",
            margin: "auto",
            marginTop: "10%",
          }}
        >
          <h2 className="text-center text-muted">Sell {stock.stockSymbol}</h2>

          <div className="d-flex">
            <TextField
              type="number"
              label="Quantity"
              variant="outlined"
              style={{ margin: "20px" }}
              value={qty}
              onChange={handleQty}
              helperText={`Available Quantity = ${availableQty}`}
            />

            <TextField
              label="@Market Price"
              variant="filled"
              value={Number.isFinite(price) ? price : "N/A"}
              style={{ margin: "20px" }}
              disabled
            />
          </div>

          <div className="d-flex justify-content-center mb-3">
            <Button
              variant="contained"
              onClick={handleButtonClick}
              disabled={loading || !qty}
              style={{
                background:
                  "linear-gradient(to bottom right, #30209B, #24BEEB)",
                color: "white",
              }}
            >
              {loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                `Sell ${stock.stockSymbol}`
              )}
            </Button>
          </div>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={errorType} sx={{ width: 400 }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
});

export default NewSellButton;
