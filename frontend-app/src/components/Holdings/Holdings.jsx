import "./Holdings.css";
import { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { getLtp } from "../../../utils/GetLtp";

export default function Holdings() {
  const [holdings, setHoldings] = useState([]);
  const [liveHoldings, setLiveHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchHoldings() {
      try {
        const res = await apiClient.get("/holdings");
        const data = res?.data?.data || [];

        if (!mounted) return;

        setHoldings(data);

        const enriched = data.map((h) => {
          const ltp = getLtp(h.name);
          return {
            ...h,
            ltp: ltp.randomNumber,
            dayChange: ltp.percentageDifference,
          };
        });

        setLiveHoldings(enriched);
      } catch (err) {
        console.error("Failed to fetch holdings", err);
        if (mounted) {
          setHoldings([]);
          setLiveHoldings([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchHoldings();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (holdings.length === 0) return;

    const interval = setInterval(() => {
      setLiveHoldings((prev) =>
        prev.map((h) => {
          const ltp = getLtp(h.name);
          return {
            ...h,
            ltp: ltp.randomNumber,
            dayChange: ltp.percentageDifference,
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [holdings]);

  if (loading) {
    return (
      <Box sx={{ width: "100%", mt: 5 }}>
        <LinearProgress />
      </Box>
    );
  }

  const investment = liveHoldings.reduce(
    (sum, h) => sum + h.avg * h.qty,
    0
  );

  const currentValue = liveHoldings.reduce(
    (sum, h) => sum + h.ltp * h.qty,
    0
  );

  const totalPL = currentValue - investment;

  return (
    <div className="container">
      <h3 className="mt-5 mb-4 text-center text-muted">
        Holdings ({liveHoldings.length})
      </h3>

      <table className="table">
        <thead>
          <tr>
            <th>Instrument</th>
            <th>Qty</th>
            <th>Avg</th>
            <th>LTP</th>
            <th>Cur Val</th>
            <th>P&L</th>
            <th>Day %</th>
          </tr>
        </thead>

        <tbody>
          {liveHoldings.map((h) => {
            const pnl = h.ltp * h.qty - h.avg * h.qty;
            return (
              <tr key={h._id}>
                <td>{h.name}</td>
                <td>{h.qty}</td>
                <td>{h.avg}</td>
                <td>{h.ltp}</td>
                <td>{Math.round(h.ltp * h.qty)}</td>
                <td className={pnl > 0 ? "green" : "red"}>
                  {Math.round(pnl)}
                </td>
                <td className={h.dayChange > 0 ? "green" : "red"}>
                  {h.dayChange}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="d-flex justify-content-around mt-4 text-center">
        <div>
          <h5>₹ {investment.toFixed(2)}</h5>
          <p>Investment</p>
        </div>
        <div>
          <h5>₹ {currentValue.toFixed(2)}</h5>
          <p>Current Value</p>
        </div>
        <div>
          <h5 className={totalPL > 0 ? "green" : "red"}>
            ₹ {totalPL.toFixed(2)}
          </h5>
          <p>P&amp;L</p>
        </div>
      </div>
    </div>
  );
}
