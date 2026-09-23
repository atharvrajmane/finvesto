import React, { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";
import { Box, LinearProgress } from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import "./Holdings.css";

export default function Holdings() {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchHoldings() {
      try {
        const res = await apiClient.get("/portfolio");
        const list = res?.data?.data || res?.data || [];
        
        if (mounted) {
          setHoldings(Array.isArray(list) ? list : []);
          setError(null);
        }
      } catch (err) {
        console.error("Fetch holdings error:", err);
        if (mounted) {
          setError("Failed to load portfolio data. Please try again.");
          setHoldings([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchHoldings();
    
    // Auto-refresh holdings every 5 seconds
    const interval = setInterval(fetchHoldings, 5000);
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const toNumberSafe = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const formatINR = (val) =>
    Number(toNumberSafe(val)).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Calculate Portfolio Totals
  let totalInvestment = 0;
  let totalCurrentValue = 0;

  holdings.forEach((h) => {
    const qty = toNumberSafe(h.quantity);
    const avg = toNumberSafe(h.averageBuyPrice);
    const ltp = toNumberSafe(h.stockId?.price || h.averageBuyPrice);
    
    totalInvestment += avg * qty;
    totalCurrentValue += ltp * qty;
  });

  const totalPnL = totalCurrentValue - totalInvestment;
  const totalPnLPercentage = totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

  return (
    <div className="summary-container mt-4 mb-3">
      {/* HEADER */}
      <div className="summary-header pb-3 d-flex justify-content-between align-items-center">
        <div>
          <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <ShowChartIcon sx={{ color: "#30209B" }} /> Holdings ({holdings.length})
          </h4>
          <p className="text-muted">Track your live portfolio performance.</p>
        </div>
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

      {/* HOLDINGS TABLE */}
      <div className="premium-card mb-5">
        <div className="table-responsive">
          <table className="table premium-table mb-0">
            <thead>
              <tr>
                <th>Instrument</th>
                <th className="text-end">Qty.</th>
                <th className="text-end">Avg. Cost</th>
                <th className="text-end">LTP</th>
                <th className="text-end">Cur. Value</th>
                <th className="text-end">P&L</th>
                <th className="text-end">Net Chg.</th>
              </tr>
            </thead>
            <tbody>
              {holdings.length === 0 && !loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    You don't have any active holdings yet.
                  </td>
                </tr>
              ) : (
                holdings.map((holding, index) => {
                  // 1. Extract values correctly from the new API structure
                  const qty = toNumberSafe(holding.quantity);
                  const avg = toNumberSafe(holding.averageBuyPrice);
                  const ltp = toNumberSafe(holding.stockId?.price || holding.averageBuyPrice); 
                  
                  const stockInfo = holding.stockId || {};
                  const displayName = stockInfo.symbol || "UNKNOWN";

                  const investment = qty * avg;
                  const currentValue = qty * ltp;
                  const pnl = currentValue - investment;
                  const pnlPercent = investment > 0 ? (pnl / investment) * 100 : 0;
                  
                  const isProfit = pnl >= 0;

                  return (
                    <tr key={holding._id || index}>
                      <td className="fw-bold text-dark">{displayName}</td>
                      <td className="text-end">{qty}</td>
                      <td className="text-end">{formatINR(avg)}</td>
                      <td className="text-end">{formatINR(ltp)}</td>
                      <td className="text-end">{formatINR(currentValue)}</td>
                      <td className={`text-end fw-bold ${isProfit ? "text-success" : "text-danger"}`}>
                        {isProfit ? "+" : ""}{formatINR(pnl)}
                      </td>
                      <td className={`text-end ${isProfit ? "text-success" : "text-danger"}`}>
                        {isProfit ? "+" : ""}{pnlPercent.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PORTFOLIO FOOTER TOTALS */}
        {holdings.length > 0 && (
          <div className="portfolio-footer bg-light p-4 border-top d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div className="d-flex gap-5 flex-wrap">
              <div>
                <span className="text-muted d-block small mb-1">Total Investment</span>
                <strong className="fs-5">{formatINR(totalInvestment)}</strong>
              </div>
              <div>
                <span className="text-muted d-block small mb-1">Current Value</span>
                <strong className="fs-5">{formatINR(totalCurrentValue)}</strong>
              </div>
            </div>
            
            <div className="text-end">
              <span className="text-muted d-block small mb-1">Total P&L</span>
              <strong className={`fs-4 ${totalPnL >= 0 ? "text-success" : "text-danger"}`}>
                {totalPnL >= 0 ? "+" : ""}{formatINR(totalPnL)} 
                <span className="fs-6 ms-2">({totalPnL >= 0 ? "+" : ""}{totalPnLPercentage.toFixed(2)}%)</span>
              </strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}