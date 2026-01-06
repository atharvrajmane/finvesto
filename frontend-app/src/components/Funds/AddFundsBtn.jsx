import React, { useState } from "react";
import { Button, Snackbar, Modal, Box, CircularProgress } from "@mui/material";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import apiClient from "../../api/apiClient";

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
      const res = await apiClient.post("/funds/add", { amount });

      if (res?.data?.success) {
        setMsgType("success");
        setMessage(res.data.message || "Funds added successfully");
        const newFunds = res?.data?.data?.fundsAvilable;
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
    <div style={{ textAlign: "center" }}>
      <Button
        variant="contained"
        onClick={handleModalOpen}
        sx={{
          background: "linear-gradient(to bottom right, #30209B, #24BEEB)",
          color: "white",
          fontWeight: 600,
        }}
      >
        ADD FUNDS
      </Button>

      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            width: { xs: "90%", md: "40%" },
            padding: 3,
            backgroundColor: "white",
            margin: "auto",
            marginTop: "10%",
            borderRadius: 2,
            boxShadow: 4,
          }}
        >
          <div className="d-flex" style={{ gap: 16, alignItems: "center" }}>
            <TextField
              value={funds}
              onChange={handleAddFundsChange}
              type="text"
              label="Enter amount"
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleButtonClick}
              disabled={loading || !funds}
              sx={{
                background: "linear-gradient(to bottom right, #30209B, #24BEEB)",
                color: "white",
                minWidth: 120,
              }}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Add"
              )}
            </Button>
          </div>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={msgType} sx={{ width: 1 }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
