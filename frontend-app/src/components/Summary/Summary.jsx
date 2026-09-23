import "./Summary.css";
import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { useAuth } from "../../context/AuthContext"; 

export default function Summary() {
  const [currentFunds, setCurrentFunds] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth(); 

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const [fundsRes, holdingsRes] = await Promise.all([
          apiClient.get("/users/balance"), 
          apiClient.get("/portfolio")      
        ]);
        const balancePayload = fundsRes?.data?.data || fundsRes?.data || {};
        const fundsVal = Number(balancePayload.balance ?? balancePayload.fundsAvilable ?? 0);
        const list = holdingsRes?.data?.data || holdingsRes?.data || [];

        if (mounted) {
          setCurrentFunds(Number.isFinite(fundsVal) ? fundsVal : 0);
          setHoldings(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        console.error("Summary fetch error:", err);
        if (mounted) {
          setCurrentFunds(0);
          setHoldings([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const toNumberSafe = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const currency = (val) =>
    Number(toNumberSafe(val)).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const investmentNumber = holdings.reduce((acc, h) => {
    const qty = toNumberSafe(h.quantity);
    const avg = toNumberSafe(h.averageBuyPrice);
    return acc + avg * qty;
  }, 0);

  const currentValueNumber = holdings.reduce((acc, h) => {
    const qty = toNumberSafe(h.quantity);
    const livePrice = toNumberSafe(h.stockId?.price || h.averageBuyPrice); 
    return acc + livePrice * qty;
  }, 0);

  const totalProfit = Math.round(currentValueNumber - investmentNumber);

  return (
    <div className="summary-container mt-4 mb-3">
      <div className="summary-header pb-3">
        <h4 className="fw-bold text-dark mb-1">
          Welcome back, {user?.username || "Trader"} 👋
        </h4>
        <p className="text-muted">Here is your portfolio summary today.</p>
        <hr className="custom-hr" />
      </div>

      <Box sx={{ width: "100%", height: "4px", mb: 3 }}>
        {loading && <LinearProgress color="primary" />}
      </Box>

      {}
      <div className="dashboard-section mb-5">
        <h5 className="section-title mb-3">Equity</h5>
        
        <div className="premium-card d-flex flex-wrap">
          <div className="card-block border-end p-4 flex-grow-1 text-center">
            <h2 className={`balance-display ${currentFunds > 0 ? "text-success" : currentFunds < 0 ? "text-danger" : ""}`}>
              {currentFunds === null ? "..." : currency(currentFunds)}
            </h2>
            <p className="text-muted mt-2 mb-0 fw-medium">Margin Available</p>
          </div>

          <div className="card-block p-4 flex-grow-1 d-flex flex-column justify-content-center px-5">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Margin Used:</span>
              <strong className="text-dark">₹0.00</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted">Opening Balance:</span>
              <strong className={currentFunds > 0 ? "text-success" : currentFunds < 0 ? "text-danger" : ""}>
                {currentFunds === null ? "..." : currency(currentFunds)}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="dashboard-section mt-5">
        <h5 className="section-title mb-3">Holdings ({holdings.length})</h5>
        
        <div className="premium-card d-flex flex-wrap align-items-center">
          <div className="card-block p-4 border-end flex-grow-1 text-center">
            <h3 className={`pnl-display mb-1 ${totalProfit >= 0 ? "text-success" : "text-danger"}`}>
              {totalProfit >= 0 ? "+" : ""}{currency(totalProfit)}
            </h3>
            <p className="text-muted fw-medium mb-0">Total P&L</p>
          </div>

          <div className="card-block p-4 flex-grow-1 px-5">
            <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
              <span className="text-muted">Current Value</span>
              <strong className="text-dark fs-5">{currency(currentValueNumber)}</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted">Total Investment</span>
              <strong className="text-dark fs-5">{currency(investmentNumber)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}