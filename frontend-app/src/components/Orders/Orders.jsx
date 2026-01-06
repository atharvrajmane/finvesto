import "./Orders.css";
import apiClient from '../../api/apiClient';
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function Orders() {
  const [placedOrders, setPlacedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function getData() {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get("/orders");

        const payload = response?.data;
        const ordersArray = response?.data?.data || [];

        if (mounted) setPlacedOrders(ordersArray);
      } catch (err) {
        console.error("Failed to fetch orders", err);
        if (mounted) {
          setPlacedOrders([]);
          setError(err?.response?.data?.message || err.message || "Failed to load orders");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    getData();

    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="orders m-5">
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders m-5">
        <div className="text-danger">Error loading orders: {error}</div>
      </div>
    );
  }

  return (
    <div className="orders m-5">
      <div className="no-orders d-flex flex-column align-items-center justify-content-center">
        <h2 className="text-muted">Orders</h2>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">Order No</th>
              <th scope="col">Type</th>
              <th scope="col">Stock</th>
              <th scope="col">Price</th>
              <th scope="col">Qty</th>
              <th scope="col">Brokerage</th>
            </tr>
          </thead>
          <tbody>
            {placedOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-muted">No orders found</td>
              </tr>
            ) : (
              placedOrders.map((currElement, idx) => {
                const key = currElement?._id || uuidv4();
                const orderNo = idx + 1;
                const orderType = currElement?.orderType || "—";
                const stockName = currElement?.stockName || "—";
                const qty = Number(currElement?.qty ?? 0);

                // Safe price
                const priceNum = Number(currElement?.AveragePrice ?? 0);
                const priceDisplay = priceNum.toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                });

                const brokerageDisplay = Number(20).toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                });

                const colorClass = orderType === "BUY" ? "green" : "red";

                return (
                  <tr key={key}>
                    <td className={colorClass}>{orderNo}</td>
                    <td className={colorClass}>{orderType}</td>
                    <td className={colorClass}>{stockName}</td>
                    <td>{priceDisplay}</td>
                    <td>{qty}</td>
                    <td>{brokerageDisplay}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
