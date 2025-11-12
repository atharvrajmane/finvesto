import React, { useState, useEffect, forwardRef } from "react";
import { Button, Snackbar, Modal, Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
// 1. CHANGED: Import our authenticated apiClient instead of the default axios
import apiClient from "../../../api/apiClient"; // <-- MAKE SURE THIS PATH IS CORRECT

const NewSellButton = forwardRef(({ stock }, ref) => {
  const [qty, setQty] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  let [message, setMessage] = useState("Place a valid Order");
  let [errorType, setErrorType] = useState("success");
  const [currentFunds, setCurrentFunds] = useState(0);
  const [avilableqty, setAvilableQty] = useState(0);

  async function executeSellOrdder(stock) {
    //Insert into order db
    let orderData = {
      orderType: "SELL",
      stockName: stock.stockSymbol,
      qty: qty,
      AveragePrice: stock.randomNumber,
    };
    console.log(orderData);
    // 2. CHANGED: Use apiClient for the POST request
    let postResult = await apiClient.post("/orders/sell", orderData);
    console.log(postResult);
  }

  useEffect(() => {
    async function getCurrentFunds() {
      // 3. CHANGED: Use apiClient for the GET request
      let funds = await apiClient.get("/funds");
      setCurrentFunds(funds.data.fundsAvilable);
    }
    getCurrentFunds();
    // CRITICAL BUG FIX: Added [] to prevent this from running on every re-render.
    // Without this, typing a single character in the quantity box would re-fetch the funds.
  }, []);

  let handleQty = (e) => {
    setQty(e.target.value);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
    setQty(0);
  };

  const handleModalOpen = async () => {
    // 4. CHANGED: Use apiClient for the POST request
    let aviableQty = await apiClient.post("/holdings/quantity", {
      name: stock.stockSymbol,
    });
    setAvilableQty(aviableQty.data.qty || 0);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setQty(0);
  };

  const handleButtonClick = async () => {
    if (qty > 0 && qty <= avilableqty) {
      executeSellOrdder(stock);
      setErrorType("success");
      setMessage(
        `Sold ${stock.stockSymbol} for ${stock.randomNumber} X ${qty}`
      );
      setSnackbarOpen(true);
      handleModalClose();
    } else {
      setErrorType("error");
      setMessage("Enter a valid Quantity");
      setSnackbarOpen(true);
      handleModalClose();
    }

    // setSnackbarOpen(true);
    // handleModalClose(); // Optionally close the modal when the button is clicked
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
              id="outlined-basic"
              label="Quantity"
              variant="outlined"
              style={{ margin: "20px" }}
              value={qty}
              onChange={handleQty}
              helperText={`Quantity Avilable = ${Number(avilableqty)}`}
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
