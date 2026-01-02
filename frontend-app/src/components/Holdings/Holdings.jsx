import { v4 as uuidv4 } from 'uuid';
import "./Holdings.css";
import { useEffect, useState } from "react";
import apiClient from '../../api/apiClient';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function Holdings() {

    const [holdings, setHoldings] = useState([]);
    const [holdingsfetched, setHoldingsFetched] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            async function getData() {
                setHoldingsFetched(false);

                let response = await apiClient.get("/holdings");

                // ✅ FIX: extract array from standardized backend response
                const holdingsArray = response?.data?.data || [];

                setHoldings(holdingsArray);
                setHoldingsFetched(true);
            }
            getData();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // --- Calculations ---
    let totalProfit =
        holdings.reduce((netTotal, currVaue) => {
            return Math.floor(netTotal + (currVaue.price * currVaue.qty));
        }, 0)
        -
        holdings.reduce((netTotal, currVaue) => {
            return Math.floor(netTotal + (currVaue.avg * currVaue.qty));
        }, 0);

    return (
        <div className="container d-flex flex-column justify-content-between h-100">
            <div className="order-table ms-5 me-5">
                <h3 className="title mt-5 mb-4 text-center text-muted">
                    Holdings ({holdings.length})
                </h3>

                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>

                <table className="table mb-5 ms-2">
                    <thead>
                        <tr>
                            <th key={uuidv4()}>Instrument</th>
                            <th key={uuidv4()}>Qty.</th>
                            <th key={uuidv4()}>Avg. cost</th>
                            <th key={uuidv4()}>LTP</th>
                            <th key={uuidv4()}>Cur Val</th>
                            <th key={uuidv4()}>P&L</th>
                            <th key={uuidv4()}>Net chg.</th>
                            <th key={uuidv4()}>Day chg.</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            holdings.map((currElement) => {
                                let pAndl = Math.floor(
                                    (currElement.price * currElement.qty) -
                                    (currElement.qty * currElement.avg)
                                );

                                let DayChange = parseFloat(currElement.day);
                                let netChange = Math.floor(currElement.price - currElement.avg);

                                return (
                                    <tr key={uuidv4()}>
                                        <td className={pAndl < 0 ? "red" : pAndl > 0 ? "green" : ""}>
                                            {currElement.name}
                                        </td>
                                        <td>{currElement.qty}</td>
                                        <td>{currElement.avg}</td>
                                        <td>{currElement.price}</td>
                                        <td>{Math.floor(currElement.price * currElement.qty)}</td>
                                        <td className={pAndl < 0 ? "red" : pAndl > 0 ? "green" : ""}>
                                            {pAndl}
                                        </td>
                                        <td className={netChange < 0 ? "red" : netChange > 0 ? "green" : ""}>
                                            {netChange}
                                        </td>
                                        <td className={DayChange < 0 ? "red" : DayChange > 0 ? "green" : ""}>
                                            {DayChange + " %"}
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>

            <div className="container d-flex align-items-center justify-content-around text-center">
                <div className="investment">
                    <h5>
                        {
                            holdings.reduce((netTotal, currVaue) => {
                                return Math.floor(netTotal + (currVaue.avg * currVaue.qty));
                            }, 0).toLocaleString('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })
                        }
                    </h5>
                    <p>Total investment</p>
                </div>

                <div className="CuurentValue">
                    <h5>
                        {
                            holdings.reduce((netTotal, currVaue) => {
                                return Math.floor(netTotal + (currVaue.price * currVaue.qty));
                            }, 0).toLocaleString('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })
                        }
                    </h5>
                    <p>Current value</p>
                </div>

                <div className="p&l">
                    <h5 className={totalProfit > 0 ? "green" : totalProfit < 0 ? "red" : ""}>
                        {
                            totalProfit.toLocaleString('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })
                        }
                    </h5>
                    <p>P&amp;L</p>
                </div>
            </div>
        </div>
    );
}
