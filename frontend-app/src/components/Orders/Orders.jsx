import "./Orders.css"
// 1. CHANGED: Import our authenticated apiClient instead of the default axios
import apiClient from '../../api/apiClient'; // <-- MAKE SURE THIS PATH IS CORRECT
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function Orders() {

    let index = 1;
    let [placedOrders, setPlacedOrders] = useState([])

    useEffect(() => {
        async function getData() {
            // 2. CHANGED: Use apiClient and the shorter URL
            let response = await apiClient.get("/orders")
            setPlacedOrders(response.data);
        }
        getData()
    // 3. CRITICAL BUG FIX: Added [] to prevent an infinite loop of API calls.
    // Without this, the component would make non-stop requests to your server.
    }, [])


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
                        {
                            placedOrders.map((currElement) => (
                                // A more stable key would be currElement._id if it's available
                                <tr key={uuidv4()}> 
                                    <td className={currElement.orderType === "BUY" ? "green" : "red"} >{index++}</td>
                                    <td className={currElement.orderType === "BUY" ? "green" : "red"} >{currElement.orderType}</td>
                                    <td className={currElement.orderType === "BUY" ? "green" : "red"}>{currElement.stockName}</td>
                                    <td>{currElement.AveragePrice.toLocaleString('en-IN', {
                                        style: 'currency',
                                        currency: 'INR',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}</td>
                                    <td>{currElement.qty}</td>
                                    <td>{Number(20).toLocaleString('en-IN', {
                                        style: 'currency',
                                        currency: 'INR',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                --------
            </div>
        </div>
    )
}