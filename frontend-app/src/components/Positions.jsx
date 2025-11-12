import { v4 as uuidv4 } from 'uuid';
// 1. CHANGED: Import our authenticated apiClient instead of the default axios
import apiClient from "../api/apiClient"; // <-- MAKE SURE THIS PATH IS CORRECT
import { useState,useEffect } from 'react';

export default function Positions() {
    const [positions,setPositions] = useState([])
    
    useEffect(()=>{
       async function getData() {
            // 2. CHANGED: Use apiClient and the shorter URL
            let response = await apiClient.get("/positions")
            setPositions(response.data);
       }
       getData()
    },[])

    return (
        <>
            <div className="container text-center">
                <h3 className="title m-5 pb-2 text-center">Positions ({positions.length})</h3>

                <div className="order-table">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Product</th>
                                <th scope="col">Instrument</th>
                                <th scope="col">Qty.</th>
                                <th scope="col">Avg.</th>
                                <th scope="col">LTP</th>
                                <th scope="col">P&L</th>
                                <th scope="col">Chg.</th>
                            </tr>
                        </thead>
                        <tbody>
                        {positions.map((position) => {

                            let pAndl = Math.floor((position.price * position.qty) - (position.avg * position.qty));

                            return (
                                <tr key={uuidv4()}>
                                    <td>{position.product}</td>
                                    <td>{position.name}</td>
                                    <td>{position.qty}</td>
                                    <td>{position.avg}</td>
                                    <td>{position.price}</td>
                                    <td className={pAndl > 0 ? "green" : pAndl < 0 ? "red":""} >{pAndl}</td>
                                    <td className={parseFloat(position.net) > 0 ? "green" : parseFloat(position.net) < 0 ? "red":""}>{position.net}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div >

        </>
    )
}