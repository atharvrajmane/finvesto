import "./Summary.css";
import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { getLtp } from "../../../utils/GetLtp";

export default function Summary() {
  const [currentFunds, setCurrentFunds] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const fundsRes = await apiClient.get("/funds");
        const fundsVal = Number(fundsRes?.data?.data?.fundsAvilable ?? 0);
        if (mounted) setCurrentFunds(Number.isFinite(fundsVal) ? fundsVal : 0);

        const holdingsRes = await apiClient.get("/holdings");
        const list = holdingsRes?.data?.data || [];
        if (mounted) setHoldings(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("summary fetch error:", err);
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
    return acc + toNumberSafe(h.avg) * toNumberSafe(h.qty);
  }, 0);

  const currentValueNumber = holdings.reduce((acc, h) => {
    const livePrice = getLtp(h.name)?.randomNumber || 0;
    return acc + livePrice * toNumberSafe(h.qty);
  }, 0);

  const totalProfit = Math.round(currentValueNumber - investmentNumber);

  return (
    <div className="container mt-5 ms-3 mb-3 text-muted">
      <div className="header mt-5 pb-3">
        <h4 className="mb-4">Welcome To Finvesto</h4>
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
        <Box sx={{ width: "100%" }}>{loading && <LinearProgress />}</Box>

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
