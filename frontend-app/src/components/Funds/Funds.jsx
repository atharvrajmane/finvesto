import Button from "@mui/material/Button";
import PieChartIcon from "@mui/icons-material/PieChart";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import AddFundsBtn from "./AddFundsBtn";
import { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

export default function Funds() {
  const [currentFunds, setCurrentFunds] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function getCurrentFunds() {
      try {
        const res = await apiClient.get("/users/balance");
        const payload = res?.data?.data || res?.data || {};
        const val = Number(payload.balance ?? payload.fundsAvilable ?? 0);
        
        if (mounted) {
          setCurrentFunds(Number.isFinite(val) ? val : 0);
          setError(null);
        }
      } catch (err) {
        console.error("Fetch funds error:", err);
        if (mounted) {
          setError(err.message || "Failed to fetch funds");
          setCurrentFunds(0);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    
    getCurrentFunds();
    
    const interval = setInterval(getCurrentFunds, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const formatINR = (value) =>
    value === null || value === undefined
      ? "..."
      : Number(value).toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  return (
    <div className="summary-container mt-4 mb-3">
      <div className="summary-header pb-3 d-flex justify-content-between align-items-center">
        <div>
          <h4 className="fw-bold text-dark mb-1">Funds</h4>
          <p className="text-muted">Manage your wallet and buying power.</p>
        </div>
        <AddFundsBtn setCurrentFunds={setCurrentFunds} />
      </div>
      <hr className="custom-hr mt-0" />

      <Box sx={{ width: "100%", height: "4px", mb: 4 }}>
        {loading && <LinearProgress color="primary" />}
      </Box>

      {error && (
        <div className="alert alert-danger mx-3" role="alert">
          {error}
        </div>
      )}

      {}
      <div className="premium-card p-0 mb-5">
        <div className="d-flex justify-content-between align-items-center p-4 border-bottom bg-light">
          <h5 className="m-0 text-dark d-flex align-items-center gap-2">
            <PieChartIcon sx={{ color: "#30209B" }} /> Equity
          </h5>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ textDecoration: "none", color: "#30209B", fontWeight: 500 }} className="d-flex align-items-center gap-1">
             View Statement <ArrowForwardIcon fontSize="small" />
          </a>
        </div>

        <div className="row m-0">
          {}
          <div className="col-md-6 p-4 border-end">
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Available margin</span>
              <strong className="text-success fs-5">{formatINR(currentFunds)}</strong>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Used margin</span>
              <strong className="text-dark fs-5">{formatINR(0)}</strong>
            </div>
            <div className="d-flex justify-content-between mb-4">
              <span className="text-muted">Available Cash</span>
              <strong className="text-dark fs-5">{formatINR(currentFunds)}</strong>
            </div>
            
            <hr className="dropdown-divider mb-4" />

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Opening Balance</span>
              <span className="text-dark fw-medium">{formatINR(currentFunds)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Pay in</span>
              <span className="text-dark fw-medium">{formatINR(0)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Pay Out</span>
              <span className="text-dark fw-medium">{formatINR(0)}</span>
            </div>
          </div>

          {}
          <div className="col-md-6 p-4 d-flex flex-column justify-content-center">
             <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Span</span>
              <span className="text-dark fw-medium">{formatINR(0)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Delivery Margin</span>
              <span className="text-dark fw-medium">{formatINR(0)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Exposure</span>
              <span className="text-dark fw-medium">{formatINR(0)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Options Premium</span>
              <span className="text-dark fw-medium">{formatINR(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}