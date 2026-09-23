import { useEffect } from "react";
import { useState } from "react"
import "./LeftBar.css"
function getRandomNumber(min, max) {
    if (min > max) {
        throw new Error("Minimum value should be less than or equal to maximum value.");
    }
    const randomNum = Math.random() * (max - min + 1) + min;
    return randomNum;
}


export default function LeftBar() {

    const [niftyValue, setNiftyValue] = useState({
        value: 21500,
        change: 0
    });
    const [sensexValue, setSensexValue] = useState({
        value: 82000,
        change: 0
    });

    useEffect(() => {
        let mounted = true;

        async function fetchMarketData() {
            try {
                const { default: apiClient } = await import("../../api/apiClient.js");
                const res = await apiClient.get("/stocks");
                const stocks = res?.data?.data || res?.data || [];

                const niftyStock = stocks.find(s => s.symbol === "NIFTY");
                const sensexStock = stocks.find(s => s.symbol === "SENSEX");

                if (mounted) {
                    if (niftyStock) {
                        setNiftyValue(prev => ({
                            value: niftyStock.price.toFixed(2),
                            change: prev.value ? (niftyStock.price - parseFloat(prev.value)).toFixed(2) : 0
                        }));
                    }
                    if (sensexStock) {
                        setSensexValue(prev => ({
                            value: sensexStock.price.toFixed(2),
                            change: prev.value ? (sensexStock.price - parseFloat(prev.value)).toFixed(2) : 0
                        }));
                    }
                }
            } catch (err) {
                console.error("Failed to fetch market indices:", err);
            }
        }

        fetchMarketData();
        const intervalId = setInterval(fetchMarketData, 5000);

        return () => {
            mounted = false;
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div className="container">
            <div className="row d-flex mt-3">
                <div className="col-md-6">
                    <div className=  {niftyValue.change > 0 ? "nifty d-flex align-items-center justify-content-center green": niftyValue.change < 0 ? "nifty d-flex align-items-center justify-content-center red" : "nifty d-flex align-items-center justify-content-center"}>
                            <p className="me-2"> <b>Nifty 50</b> </p>
                            <p className="me-2">{niftyValue.value}</p>
                            <p>{niftyValue.change}</p>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className=  {sensexValue.change > 0 ? "sensex d-flex align-items-center justify-content-center green": sensexValue.change < 0 ? "sensex d-flex align-items-center justify content center red" : "sensex d-flex align-items-center justify content center"}>
                        <p className="me-2"> <b>Sensex</b></p>
                        <p className="me-2">{sensexValue.value}</p>
                        <p>{sensexValue.change}</p>
                    </div>
                </div>
            </div>


        </div>
    )
}