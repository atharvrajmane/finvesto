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

  async function getCurrentFunds() {
    try {
      const res = await apiClient.get("/funds");
      const payload = res?.data?.data;
      if (payload && typeof payload.fundsAvilable !== "undefined") {
        setCurrentFunds(Number(payload.fundsAvilable));
      }
    } catch (err) {
      console.error("getCurrentFunds error:", err);
    }
  }

  const handleAddFundsChange = (e) => {
    setFunds(e.target.value);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

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
      // <-- SEND field name 'amount' to match backend validation
      const resultPost = await apiClient.post("/funds/add", { amount: amount });

      console.log("add funds response:", resultPost?.data); // debug, remove later

      if (resultPost?.data?.success) {
        setMsgType("success");
        setMessage(resultPost.data.message || "Added Funds Successfully");
        const newFunds = resultPost?.data?.data?.fundsAvilable;
        if (typeof newFunds !== "undefined") setCurrentFunds(Number(newFunds));
        else await getCurrentFunds();
        setFunds("");
      } else {
        setMsgType("error");
        setMessage(resultPost?.data?.message || "Failed to add funds");
      }
    } catch (err) {
      console.error("add funds error:", err);
      const serverMessage = err?.response?.data?.message || 
                            // fallback: express-validator style errors array
                            (err?.response?.data?.errors ? err.response.data.errors.map(e=>e.msg).join(", ") : null) ||
                            err?.message || "Add funds failed";
      setMsgType("error");
      setMessage(serverMessage);
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
      handleModalClose();
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Button
        variant="contained"
        onClick={handleModalOpen}
        sx={{ backgroundColor: "rgb(40,184,81)", color: "white" }}
      >
        ADD FUNDS
      </Button>

      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            width: { xs: "90%", md: "50%" },
            padding: 2,
            backgroundColor: "white",
            margin: "auto",
            marginTop: "10%",
            borderRadius: 1,
            boxShadow: 3,
          }}
        >
          <div className="container d-flex" style={{ gap: 16, alignItems: "center" }}>
            <TextField
              value={funds}
              onChange={handleAddFundsChange}
              id="outlined-basic"
              type="number"
              label="Enter Funds to Add"
              variant="outlined"
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleButtonClick}
              disabled={loading}
              sx={{ color: "white", backgroundColor: "green" }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Add Funds"}
            </Button>
          </div>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
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
