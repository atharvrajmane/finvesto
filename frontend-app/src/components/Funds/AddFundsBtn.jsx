import React, { useState } from "react";
import { Button, Snackbar, Modal, Box, CircularProgress } from "@mui/material";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import apiClient from "../../api/apiClient";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

export default function AddFundsBtn({ setCurrentFunds }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [funds, setFunds] = useState("");
  const [msgType, setMsgType] = useState("success");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => {
    if (!loading) setModalOpen(false);
  };

  const handleAddFundsChange = (e) => {
    const raw = e.target.value;
    if (raw === "") {
      setFunds("");
      return;
    }
    if (!/^\d+(\.\d{0,2})?$/.test(raw)) return; // numeric + 2 decimals
    setFunds(raw);
  };

  const handleButtonClick = async () => {
    const amount = Number(funds);

    if (!Number.isFinite(amount) || amount <= 0) {
      setMsgType("error");
      setMessage("Enter a valid positive amount");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      // HIT THE NEW BACKEND ROUTE
      const res = await apiClient.post("/users/balance/add", { amount });

      if (res?.data?.success || res?.status === 200) {
        setMsgType("success");
        setMessage(res?.data?.message || "Funds added successfully!");
        
        // Extract the updated balance from the new API response structure
        const payload = res?.data?.data || res?.data || {};
        const newFunds = payload.balance ?? payload.fundsAvilable;
        
        if (typeof newFunds !== "undefined") {
          setCurrentFunds(Number(newFunds));
        }

        setFunds("");
      } else {
        setMsgType("error");
        setMessage(res?.data?.message || "Failed to add funds");
      }
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ||
        (err?.response?.data?.errors
          ? err.response.data.errors.map((e) => e.msg).join(", ")
          : null) ||
        err?.message ||
        "Add funds failed";

      setMsgType("error");
      setMessage(serverMessage);
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
        onClick={handleModalOpen}
        startIcon={<AccountBalanceWalletIcon />}
        sx={{
          background: "linear-gradient(to bottom right, #30209B, #24BEEB)",
          color: "white",
          fontWeight: 600,
          textTransform: "none",
          padding: "8px 20px",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(48, 32, 155, 0.2)",
        }}
      >
        Add Funds
      </Button>

      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            width: { xs: "90%", md: "400px" },
            padding: 4,
            backgroundColor: "white",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "16px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            outline: "none"
          }}
        >
          <h5 className="fw-bold mb-1 text-dark">Add to Wallet</h5>
          <p className="text-muted mb-4 small">Instantly increase your buying power.</p>
          
          <div className="d-flex flex-column" style={{ gap: 20 }}>
            <TextField
              value={funds}
              onChange={handleAddFundsChange}
              type="text"
              label="Enter amount (₹)"
              variant="outlined"
              fullWidth
              autoFocus
            />
            <Button
              variant="contained"
              onClick={handleButtonClick}
              disabled={loading || !funds}
              fullWidth
              sx={{
                background: "linear-gradient(to bottom right, #30209B, #24BEEB)",
                color: "white",
                padding: "12px",
                fontWeight: "bold",
                borderRadius: "8px"
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                `Add ${funds ? "₹" + funds : "Funds"}`
              )}
            </Button>
          </div>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={msgType} sx={{ width: 1, borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}