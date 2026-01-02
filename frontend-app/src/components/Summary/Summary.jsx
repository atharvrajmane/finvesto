// src/components/Summary/Summary.jsx
import "./Summary.css";
import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

export default function Summary() {
  const [currentFunds, setCurrentFunds] = useState(null); // null = loading/unset
  const [holdings, setHoldings] = useState([]);
  const [loadingHoldings, setLoadingHoldings] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchOnce() {
      try {
        // Fetch funds
        const fundsRes = await apiClient.get("/funds");
        // envelope: { success, message, data }
        const fundsPayload = fundsRes?.data?.data;
        const fundsVal = Number(fundsPayload?.fundsAvilable ?? 0);
        if (mounted) setCurrentFunds(Number.isFinite(fundsVal) ? fundsVal : 0);
      } catch (err) {
        console.error("fetch funds error:", err);
        if (mounted) setCurrentFunds(0);
      }

      try {
        // Fetch holdings
        const holdRes = await apiClient.get("/holdings");
        // server may return envelope or raw array; prefer envelope
        const holdPayload = holdRes?.data?.data ?? holdRes?.data ?? [];
        if (mounted) setHoldings(Array.isArray(holdPayload) ? holdPayload : []);
      } catch (err) {
        console.error("fetch holdings error:", err);
        if (mounted) setHoldings([]);
      } finally {
        if (mounted) setLoadingHoldings(false);
      }
    }

    // initial fetch
    fetchOnce();

    // interval refresh (optional). keep interval if you want live updates
    const interval = setInterval(fetchOnce, 4000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // safe numeric helpers
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

  // compute totals defensively
  const investmentNumber = holdings.reduce((acc, h) => {
    const avg = toNumberSafe(h.avg);
    const qty = toNumberSafe(h.qty);
    return acc + avg * qty;
  }, 0);

  const currentValueNumber = holdings.reduce((acc, h) => {
    const price = toNumberSafe(h.price);
    const qty = toNumberSafe(h.qty);
    return acc + price * qty;
  }, 0);

  const totalProfit = Math.round(currentValueNumber - investmentNumber);

  return (
    <div className="container mt-5 ms-3 mb-3 text-muted">
      <div className="header mt-5 pb-3">
        <h4 className="mb-4">Welcome To kite</h4>
        <hr />
      </div>

      <div className="equity mb-5">
        <h4 className="mb-2">Equity</h4>
        <div className="holdingSummary d-flex">
          <div className="avilableMargin p-4 d-flex flex-column align-items-center justify-content-center border-end">
            <h2 className={currentFunds > 0 ? "green" : currentFunds < 0 ? "red" : ""}>
              {currentFunds === null ? "Loading..." : currency(currentFunds)}
            </h2>
            <p className="mt-1">Margin Available</p>
          </div>

          <div className="MarginSummary ms-4 d-flex flex-column align-items-start justify-content-center">
            <p>Margin Used : 0</p>
            <p className={currentFunds > 0 ? "green" : currentFunds < 0 ? "red" : ""}>
              Opening Balance : {currentFunds === null ? "Loading..." : currency(currentFunds)}
            </p>
          </div>
        </div>
        <hr />
      </div>

      <div className="holdings mt-5">
        <h4 className="mt-4 mb-2">Holdings ({holdings.length})</h4>
        <Box sx={{ width: "100%" }}>{loadingHoldings ? <LinearProgress /> : null}</Box>

        <div className="data d-flex" style={{ alignItems: "center" }}>
          <div className="first p-4 border-end">
            <h3 className={totalProfit > 0 ? "green" : totalProfit < 0 ? "red" : ""}>
              {currency(totalProfit)}
            </h3>
            <p>P&L</p>
          </div>

          <div className="second m-4" style={{ lineHeight: 1.6 }}>
            <p>
              Current Value <br />
              <span>{currency(currentValueNumber)}</span>
            </p>
            <p>
              Investment <br />
              <span>{currency(investmentNumber)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
