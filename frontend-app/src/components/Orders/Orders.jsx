import React, { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import { Box, LinearProgress } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import "./Orders.css";

export default function Orders() {
  const [placedOrders, setPlacedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get("/trading");

        // Safely extract the array regardless of exact backend nesting
        const ordersArray = response?.data?.data || response?.data || [];

        if (mounted)
          setPlacedOrders(Array.isArray(ordersArray) ? ordersArray : []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
        if (mounted) {
          setPlacedOrders([]);
          setError(
            err?.response?.data?.message || "Failed to load your order history."
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchOrders();
    return () => {
      mounted = false;
    };
  }, []);

  const formatINR = (val) =>
    Number(val).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Helper to format timestamps if your backend provides them (e.g., createdAt)
  const formatTime = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return isNaN(date)
      ? "—"
      : date.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  return (
    <div className="summary-container mt-4 mb-3">
      {/* HEADER */}
      <div className="summary-header pb-3 d-flex justify-content-between align-items-center">
        <div>
          <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <ReceiptLongIcon sx={{ color: "#30209B" }} /> Order History
          </h4>
          <p className="text-muted">
            Review your past transactions and executed trades.
          </p>
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

      {/* ORDERS TABLE */}
      <div className="premium-card mb-5">
        <div className="table-responsive">
          <table className="table premium-table mb-0">
            <thead>
              <tr>
                <th>Time</th>
                <th>Instrument</th>
                <th>Type</th>
                <th className="text-end">Qty.</th>
                <th className="text-end">Exec. Price</th>
                <th className="text-end">Brokerage</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {placedOrders.length === 0 && !loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div className="text-muted mb-2">
                      You haven't placed any orders yet.
                    </div>
                  </td>
                </tr>
              ) : (
                (() => {
                  // Group orders by date
                  const groupedOrders = placedOrders.reduce((acc, order) => {
                    const dateObj = new Date(order?.createdAt);
                    const dateString = isNaN(dateObj) ? "Unknown Date" : dateObj.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    });
                    if (!acc[dateString]) acc[dateString] = [];
                    acc[dateString].push(order);
                    return acc;
                  }, {});

                  // Sort dates descending
                  const sortedDates = Object.keys(groupedOrders).sort((a, b) => {
                    if (a === "Unknown Date") return 1;
                    if (b === "Unknown Date") return -1;
                    return new Date(b) - new Date(a);
                  });

                  return sortedDates.map((date) => (
                    <React.Fragment key={date}>
                      <tr style={{ backgroundColor: "#f9fafb" }}>
                        <td colSpan="7" className="fw-bold text-muted py-2 px-3 border-bottom-0" style={{ fontSize: "0.9rem" }}>
                          📅 {date}
                        </td>
                      </tr>
                      {groupedOrders[date].map((order, idx) => {
                        const key = order?._id || `order-${idx}`;

                        // Map fields from JSON structure
                        const orderType = (order?.type || "BUY").toUpperCase();
                        const stockName = order?.stockId?.symbol || "UNKNOWN";
                        const qty = Number(order?.quantity ?? 0);
                        const priceNum = Number(order?.priceAtExecution ?? 0);

                        // Static brokerage for UI purposes
                        const brokerage = 20.0;
                        const isBuy = orderType === "BUY";

                        return (
                          <tr key={key}>
                            <td className="text-muted">
                              {formatTime(order?.createdAt)}
                            </td>
                            <td className="fw-bold text-dark">{stockName}</td>
                            <td>
                              <span
                                className={`order-badge ${
                                  isBuy ? "badge-buy" : "badge-sell"
                                }`}
                              >
                                {orderType}
                              </span>
                            </td>
                            <td className="text-end fw-medium">{qty}</td>
                            <td className="text-end">{formatINR(priceNum)}</td>
                            <td className="text-end text-muted">
                              {formatINR(brokerage)}
                            </td>
                            <td className="text-center">
                              <span className="status-badge status-complete">
                                Complete
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ));
                })()
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
