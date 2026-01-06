import React, { useState, useEffect, forwardRef } from "react";
import { Button, Snackbar, Modal, Box, CircularProgress } from "@mui/material";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import apiClient from "../../../api/apiClient";

const NewBuyButton = forwardRef(({ stock }, ref) => {
  const [qty, setQty] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [errorType, setErrorType] = useState("success");
  const [currentFunds, setCurrentFunds] = useState(0);
  const [loading, setLoading] = useState(false);

  const price = Number(stock?.randomNumber);
  const maxQty =
    Number.isFinite(price) && price > 0 ? Math.floor(currentFunds / price) : 0;

  async function getCurrentFunds() {
    try {
      const res = await apiClient.get("/funds");
      const payload = res?.data?.data;
      const val = Number(payload?.fundsAvilable ?? 0);
      setCurrentFunds(Number.isFinite(val) ? val : 0);
    } catch (err) {
      console.error("getCurrentFunds error:", err);
      setCurrentFunds(0);
    }
  }

  useEffect(() => {
    getCurrentFunds();
  }, []);

  async function executeBuyOrder() {
    const numericQty = Number(qty);

    const payload = {
      orderType: "BUY",
      stockName: stock.stockSymbol ?? stock.name,
      qty: numericQty,
      AveragePrice: price,
    };

    const res = await apiClient.post("/orders/buy", payload);
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
    if (numeric > 0 && numeric <= maxQty) {
      setQty(raw);
    }
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

    if (numericQty > maxQty) {
      setMessage("Insufficient funds");
      setErrorType("error");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      const data = await executeBuyOrder();
      if (data?.success) {
        setMessage(data.message || "Buy order placed successfully");
        setErrorType("success");
        setQty("");
        await getCurrentFunds();
      } else {
        setMessage(data?.message || "Order failed");
        setErrorType("error");
      }
    } catch (err) {
      setMessage(
        err?.response?.data?.message || err?.message || "Order failed"
      );
      setErrorType("error");
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
      setModalOpen(false);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => setModalOpen(true)}
        style={{
          background: "linear-gradient(to bottom right, #30209B, #24BEEB)",
          color: "white",
          fontWeight: 600,
        }}
      >
        ➕ B
      </Button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            width: 500,
            padding: 2,
            backgroundColor: "white",
            margin: "auto",
            marginTop: "10%",
          }}
        >
          <h2 className="text-center text-muted">Buy {stock.stockSymbol}</h2>

          <div className="d-flex">
            <TextField
              type="number"
              label="Quantity"
              variant="outlined"
              style={{ margin: "20px" }}
              value={qty}
              onChange={handleQty}
              helperText={`Max Quantity = ${maxQty}`}
            />

            <TextField
              label="@Market Price"
              variant="filled"
              value={Number.isFinite(price) ? price : "N/A"}
              style={{ margin: "20px" }}
              disabled
            />
          </div>

          <div className="text-center mb-3">
            <b>
              Margin Available:{" "}
              {currentFunds.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </b>
          </div>

          <div className="d-flex justify-content-center">
            <Button
              variant="contained"
              onClick={handleButtonClick}
              disabled={loading || !qty}
            >
              {loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                `Buy ${stock.stockSymbol}`
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

export default NewBuyButton;
