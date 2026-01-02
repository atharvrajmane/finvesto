import React, { useState, useEffect, forwardRef } from "react";
import { Button, Snackbar, Modal, Box, CircularProgress } from "@mui/material";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import apiClient from "../../../api/apiClient";

const NewBuyButton = forwardRef(({ stock }, ref) => {
  // keep initial types similar to original (qty controlled)
  const [qty, setQty] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("Place a valid Order");
  const [errorType, setErrorType] = useState("success");
  const [currentFunds, setCurrentFunds] = useState(0);
  const [loading, setLoading] = useState(false);

  // helper - safe number
  const toNumberSafe = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  // fetch funds once on mount (use original function name flow)
  async function getCurrentFunds() {
    try {
      const res = await apiClient.get("/funds");
      // backend uses envelope { success, message, data }
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
    // run only once, like your original code's intention
  }, []);

  // preserve original executeBuyOrdder name but implement properly
  async function executeBuyOrdder(stock) {
    const numericQty = Number(qty);
    const payload = {
      orderType: "BUY",
      stockName: stock.stockSymbol ?? stock.name,
      qty: numericQty,
      AveragePrice: Number(stock.randomNumber),
    };
    const res = await apiClient.post("/orders/buy", payload);
    return res?.data;
  }

  // original handleQty behaviour, but allow clearing input and numeric-only
  let handleQty = (e) => {
    const raw = e.target.value;
    if (raw === "") {
      setQty("");
      return;
    }
    // allow only digits and no leading plus/minus/decimal
    if (!/^\d+$/.test(raw)) return;

    const numeric = Number(raw);
    const max = Math.floor(Number(currentFunds / stock.randomNumber) || 0);
    // keep same validation behavior as original but don't block user from typing a number slightly over max:
    if (numeric >= 0 && numeric <= max) {
      setQty(raw);
    } else {
      // if it's greater than max, do not update (to match original strictness)
      // this keeps the user from entering an invalid qty
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleButtonClick = async () => {
    const numericQty = Number(qty);
    const maxQty = Math.floor(Number(currentFunds / stock.randomNumber) || 0);

    if (!Number.isFinite(numericQty) || numericQty <= 0) {
      setMessage("Enter a valid qunatity");
      setSnackbarOpen(true);
      setErrorType("error");
      handleModalClose();
      return;
    }

    if (numericQty > maxQty) {
      setMessage("Enter a valid qunatity");
      setSnackbarOpen(true);
      setErrorType("error");
      handleModalClose();
      setQty("");
      return;
    }

    // valid path: call API and await result
    setLoading(true);
    try {
      const data = await executeBuyOrdder(stock);
      if (data?.success) {
        // show server message if present else fallback
        setMessage(data.message || `Order Executed Successfully. Bought ${stock.name} x ${numericQty}.`);
        setErrorType("success");

        // update funds from server if available, otherwise refetch
        const newFunds = data?.data?.fundsAvilable;
        if (typeof newFunds !== "undefined") setCurrentFunds(Number(newFunds));
        else await getCurrentFunds();

        setQty("");
      } else {
        // server returned success:false
        setMessage(data?.message || "Order failed");
        setErrorType("error");
      }
    } catch (err) {
      console.error("executeBuyOrdder error:", err);
      const serverMessage =
        err?.response?.data?.message ||
        (err?.response?.data?.errors ? err.response.data.errors.map((x) => x.msg).join(", ") : null) ||
        err?.message ||
        "Order failed";
      setMessage(serverMessage);
      setErrorType("error");
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
      handleModalClose();
    }
  };

  // preserve original look: button "B", modal Box width 500px etc.
  return (
    <div>
      <Button variant="contained" onClick={handleModalOpen}>
        B
      </Button>

      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            width: "500px",
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
              id="outlined-basic"
              label="Quantity"
              variant="outlined"
              style={{ margin: "20px" }}
              value={qty}
              onChange={handleQty}
              helperText={`Max Quantity = ${Math.floor(Number(currentFunds / stock.randomNumber) || 0)}`}
            />
            <br />
            <TextField
              id="filled-basic"
              label="@Market Price"
              variant="filled"
              value={stock.randomNumber}
              style={{ margin: "20px" }}
              disabled
            />
          </div>
          <span className="d-flex align-items-center justify-content-center">
            {" "}
            <b>
              Margin Avilable :{" "}
              {currentFunds?.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || "N/A"}{" "}
            </b>{" "}
          </span>
          <br />
          <div className="d-flex  align-items-center justify-content-center mb-2 ">
            <Button variant="contained" onClick={handleButtonClick} disabled={loading || !qty}>
              {loading ? <CircularProgress size={18} color="inherit" /> : `Buy ${stock.stockSymbol}`}
            </Button>
          </div>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={errorType} style={{ width: "500px", height: "50px" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
});

export default NewBuyButton;
