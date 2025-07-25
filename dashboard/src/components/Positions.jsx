import React, {useState, useEffect} from "react";
import axios from "axios";

import { positions } from "../data/data";

const Positions = () => {

  const [allPositions,setAllPositions]=useState([]);
  
    useEffect(() => {
      axios.get("http://localhost:8080/allPositions").then((res)=>{
        setAllPositions(res.data);
      })
    }, []);

  return (
    <>
      <h3 className="title">Positions ({allPositions.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&amp;L</th>
              <th>Chg.</th>
            </tr>
          </thead>
          <tbody>
            {allPositions.map((item, index) => {
              const currentVal = item.qty * item.price;
              const isProfit = currentVal - item.avg * item.qty >= 0.0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = item.isLoss ? "loss" : "profit";
              return (
                <tr key={index}>
                  <td>{item.product}</td>
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
                  <td>{item.avg.toFixed(2)}</td>
                  <td>{item.price.toFixed(2)}</td>
                  <td className={profClass}>
                    {(currentVal - item.avg * item.qty).toFixed(2)}
                  </td>
                  
                  <td className={dayClass}>{item.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;
