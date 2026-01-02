import React, { useState, useEffect, forwardRef } from "react";
import { Button, Snackbar, Modal, Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import apiClient from "../../../api/apiClient";

const NewSellButton = forwardRef(({ stock }, ref) => {
  // ✅ FIX: controlled input from first render
  const [qty, setQty] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("Place a valid Order");
  const [errorType, setErrorType] = useState("success");
  const [currentFunds, setCurrentFunds] = useState(0);
  const [avilableqty, setAvilableQty] = useState(0);

  async function executeSellOrdder(stock) {
    let orderData = {
      orderType: "SELL",
      stockName: stock.stockSymbol,
      qty: Number(qty),
      AveragePrice: stock.randomNumber,
    };
    await apiClient.post("/orders/sell", orderData);
  }

  useEffect(() => {
    async function getCurrentFunds() {
      let res = await apiClient.get("/funds");
      setCurrentFunds(res?.data?.data?.fundsAvilable || 0);
    }
    getCurrentFunds();
  }, []);

  let handleQty = (e) => {
    setQty(e.target.value);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
    setQty("");
  };

  const handleModalOpen = async () => {
    let res = await apiClient.post("/holdings/quantity", {
      name: stock.stockSymbol,
    });
    setAvilableQty(res?.data?.data?.qty || 0);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setQty("");
  };

  const handleButtonClick = async () => {
    if (qty > 0 && qty <= avilableqty) {
      await executeSellOrdder(stock);
      setErrorType("success");
      setMessage(`Sold ${stock.stockSymbol} for ${stock.randomNumber} X ${qty}`);
      setSnackbarOpen(true);
      handleModalClose();
    } else {
      setErrorType("error");
      setMessage("Enter a valid Quantity");
      setSnackbarOpen(true);
      handleModalClose();
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleModalOpen}
        style={{ backgroundColor: "orangered", color: "whitesmoke" }}
      >
        S
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
          <h2 className="text-center text-muted">SELL {stock.stockSymbol}</h2>

          <div className="d-flex">
            <TextField
              type="number"
              label="Quantity"
              variant="outlined"
              style={{ margin: "20px" }}
              value={qty}
              onChange={handleQty}
              helperText={`Quantity Avilable = ${avilableqty}`}
            />

            <TextField
              label="@Market Price"
              variant="filled"
              value={stock.randomNumber}
              style={{ margin: "20px" }}
              disabled
            />
          </div>

          <span className="d-flex align-items-center justify-content-center">
            <b>
              Margin Avilable :{" "}
              {currentFunds.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </b>
          </span>

          <br />

          <div className="d-flex align-items-center justify-content-center mb-2">
            <Button
              variant="contained"
              onClick={handleButtonClick}
              style={{ backgroundColor: "orangered", color: "whitesmoke" }}
            >
              SELL {stock.stockSymbol}
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

export default NewSellButton;
