import React, { useState, useEffect } from "react";
import { Button, Snackbar, Modal, Box, CircularProgress, TextField, Alert } from "@mui/material";
import { v4 as uuidv4 } from 'uuid'; // Ensure you have installed uuid: npm install uuid
import apiClient from "../../../api/apiClient";

export default function NewBuyButton({ stock }) {
  const [qty, setQty] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState(null);
  const [message, setMessage] = useState("");
  const [errorType, setErrorType] = useState("success");
  const [currentFunds, setCurrentFunds] = useState(0);
  const [loading, setLoading] = useState(false);

  const price = Number(stock?.ltp || stock?.price || 0);
  const maxQty = Number.isFinite(price) && price > 0 ? Math.floor(currentFunds / price) : 0;
  const handleOpenModal = () => {
    setIdempotencyKey(uuidv4()); // Key is generated once per modal session
    setModalOpen(true);
  };

  async function getCurrentFunds() {
    try {
      const res = await apiClient.get("/users/balance");
      const payload = res?.data?.data || res?.data || {};
      const val = Number(payload.balance ?? payload.fundsAvilable ?? 0);
      setCurrentFunds(Number.isFinite(val) ? val : 0);
    } catch (err) {
      console.error("getCurrentFunds error:", err);
    }
  }

  useEffect(() => {
    if (modalOpen) getCurrentFunds();
  }, [modalOpen]);

  const handleButtonClick = async () => {
    const numericQty = Number(qty);

    if (numericQty <= 0 || numericQty > maxQty) {
      setMessage(numericQty > maxQty ? "Insufficient funds" : "Enter a valid quantity");
      setErrorType("error");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        orderType: "BUY",
        stockId: stock._id || stock.stockId,
        quantity: numericQty,
        price: price,
      };
      const res = await apiClient.post("/trading/buy", payload, {
        headers: {
          'Idempotency-Key': idempotencyKey 
        }
      });
      
      if (res?.data?.success || res?.status === 200) {
        setMessage("Buy order placed successfully!");
        setErrorType("success");
        setQty("");
        setModalOpen(false);
      } else {
        throw new Error(res?.data?.message || "Order failed");
      }
    } catch (err) {
      setMessage(err?.response?.data?.message || err?.message || "Order failed");
      setErrorType("error");
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpenModal}
        size="small"
        sx={{
          background: "#10b981",
          color: "white",
          fontWeight: 600,
          minWidth: "40px",
          padding: "4px 8px",
          "&:hover": { background: "#059669" }
        }}
      >
        B
      </Button>

      <Modal open={modalOpen} onClose={() => !loading && setModalOpen(false)}>
        <Box
          sx={{
            width: { xs: '90%', sm: 400 },
            p: 4,
            backgroundColor: "white",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: 3,
            boxShadow: 24,
            outline: "none"
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold m-0 text-success">Buy {stock?.stockSymbol || stock?.name}</h5>
            <span className="text-muted fw-bold">₹{price.toFixed(2)}</span>
          </div>

          <TextField
            type="number"
            label="Quantity"
            variant="outlined"
            fullWidth
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            helperText={`Max Qty: ${maxQty} | Available: ₹${currentFunds.toFixed(2)}`}
            sx={{ mb: 3 }}
            autoFocus
          />

          <Button
            variant="contained"
            onClick={handleButtonClick}
            disabled={loading || !qty}
            fullWidth
            sx={{ background: "#10b981", py: 1.5, fontWeight: "bold", "&:hover": { background: "#059669" } }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Place Buy Order"}
          </Button>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={errorType} variant="filled" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}