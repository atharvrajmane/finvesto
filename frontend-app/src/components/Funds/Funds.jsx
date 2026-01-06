import Button from "@mui/material/Button";
import PieChartIcon from "@mui/icons-material/PieChart";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import AddFundsBtn from "./AddFundsBtn";
import { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";

export default function Funds() {
  const [currentFunds, setCurrentFunds] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getCurrentFunds() {
      setLoading(true);
      try {
        const res = await apiClient.get("/funds");
        const payload = res?.data?.data;
        if (!payload) throw new Error(res?.data?.message || "Invalid response");
        const val = Number(payload.fundsAvilable ?? 0);
        setCurrentFunds(Number.isFinite(val) ? val : 0);
        setError(null);
      } catch (err) {
        console.error("fetch funds error:", err);
        setError(err.message || "Failed to fetch funds");
        setCurrentFunds(0);
      } finally {
        setLoading(false);
      }
    }
    getCurrentFunds();
  }, []);

  const formatINR = (value) =>
    value === null || value === undefined
      ? "N/A"
      : Number(value).toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  return (
    <>
      <div className="container p-4">
        <div className="addWithdrawButtons d-flex align-items-center justify-content-center mt-3">
          <AddFundsBtn setCurrentFunds={setCurrentFunds} />
        </div>

        <div className="equity d-flex m-5 align-items-center justify-content-around">
          <div className="headings">
            <h4 className="text-muted">
              <PieChartIcon /> Equity
            </h4>
          </div>
          <div className="statement">
            <a href="#" onClick={(e) => e.preventDefault()} style={{ textDecoration: "none" }}>
              <TripOriginIcon /> View Statement <ArrowForwardIcon />
            </a>
          </div>
        </div>

        <div className="detail mt-3 row justify-content-center">
          <div className="col-md-6">
            <p>Available margin : </p>
            <p>Used margin : </p>
            <p>Available Cash : </p>
            <hr />
            <p>Opening Balance : </p>
            <p>Pay in : </p>
            <p>Pay Out : </p>
            <p>Span : </p>
            <p>Delivery Margin : </p>
            <p>Exposure : </p>
            <p>Options Premium : </p>
            <hr />
          </div>

          <div className="col-md-6 text-end">
            <p>{loading ? "Loading..." : formatINR(currentFunds)}</p>
            <p>
              {Number(0.0).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p>
              {Number(0.0).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <hr />
            <p>{loading ? "Loading..." : formatINR(currentFunds)}</p>
            <p>
              {Number(0.0).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p>
              {Number(0.0).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p>
              {Number(0.0).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p>
              {Number(0.0).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="mb-3 pb-2">
              {Number(0.0).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <hr className="mt-5 pt-5" />
          </div>
        </div>

        {error && (
          <div style={{ color: "red", textAlign: "center", marginTop: 12 }}>
            Error: {error}
          </div>
        )}
      </div>
    </>
  );
}
