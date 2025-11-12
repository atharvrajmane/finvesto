import "./Summary.css";
import { useState, useEffect } from "react";
// 1. CHANGED: Import our authenticated apiClient instead of the default axios
import apiClient from "../../api/apiClient"; // <-- MAKE SURE THIS PATH IS CORRECT
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

export default function Summary() {
  const data = [
    { label: "Group A", value: 400 },
    { label: "Group B", value: 300 },
    { label: "Group C", value: 300 },
    { label: "Group D", value: 200 },
  ];
  const [currentFunds, setCurrentFunds] = useState(0);
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    // I've assigned the interval to a variable to add the cleanup function.
    // This is a critical bug fix to prevent memory leaks, not a logic change.
    const interval = setInterval(() => {
      async function getCurrentFunds() {
        // 2. CHANGED: Use apiClient and the shorter URL
        let funds = await apiClient.get("/funds");
        setCurrentFunds(funds.data.fundsAvilable);
      }
      async function getData() {
        // 3. CHANGED: Use apiClient and the shorter URL
        let response = await apiClient.get("/holdings");
        setHoldings(response.data);
      }
      getData();
      getCurrentFunds();
    }, 4000);

    // This cleanup function is essential to stop the interval when you leave the page.
    return () => clearInterval(interval);
  }, []);

  let totalProfit =
    holdings.reduce((netTotal, currVaue, curIndex) => {
      return Math.floor(netTotal + currVaue.price * currVaue.qty);
    }, 0) -
    holdings.reduce((netTotal, currVaue, curIndex) => {
      return Math.floor(netTotal + currVaue.avg * currVaue.qty);
    }, 0);

  let investment = holdings
    .reduce((netTotal, currVaue, curIndex) => {
      return Math.floor(netTotal + currVaue.avg * currVaue.qty);
    }, 0)
    .toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  let currentValue = holdings
    .reduce((netTotal, currVaue, curIndex) => {
      return Math.floor(netTotal + currVaue.price * currVaue.qty);
    }, 0)
    .toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="container mt-5 ms-3 mb-3 text-muted ">
      <div className="header mt-5 pb-3">
        <h4 className="mb-4">Welcome To kite</h4>
        <hr />
      </div>

      <div className="equity mb-5">
        <h4 className="mb-2">Equity</h4>
        <div className="holdingSummary d-flex">
          <div className="avilableMargin p-5  d-flex flex-column align-items-center justify-content-center border-end">
            <h2
              className={
                currentFunds > 0 ? "green" : currentFunds < 0 ? "red" : ""
              }
            >
              {currentFunds?.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || "N/A"}
            </h2>
            <p className="mt-1">Margin Avilable</p>
          </div>
          <div className="MarginSummary ms-5 d-flex flex-column align-items-center justify-content-center">
            <p>Margin Used : 0</p>
            <p
              className={
                currentFunds > 0 ? "green" : currentFunds < 0 ? "red" : ""
              }
            >
              Opening Balance :{" "}
              {currentFunds?.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || "N/A"}
            </p>
          </div>
        </div>
        <hr />
      </div>

      <div className="holdings mt-5">
        <h4 className="mt-4 mb-2">Holdings(13)</h4>
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
        <div className="data d-flex">
          <div className="first p-5 border-end">
            <h3
              className={
                totalProfit > 0 ? "green" : totalProfit < 0 ? "red" : ""
              }
            >
              {totalProfit?.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || "N/A"}
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second m-5">
            <p>
              Current Value <br />
              <span>{currentValue || "N/A"}</span>
              {"k"}
            </p>
            <p>
              Investment <br />
              <span>{investment || "N/A"}</span>
              {"k"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
