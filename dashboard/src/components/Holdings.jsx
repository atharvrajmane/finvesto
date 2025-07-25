import React, {useState, useEffect} from "react";
import axios from "axios";

// import { holdings } from "../data/data";

const Holdings = () => {
  const [allHoldings,setAllHoldings]=useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/allHoldings").then((res)=>{
      setAllHoldings(res.data);
    })
  }, []);

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&amp;L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>
          <tbody>
            {allHoldings.map((item, index) => {
              const currentVal = (item.qty * item.price);
              const isProfit=currentVal- item.avg * item.qty >=0.0;
              const profClass=isProfit?"profit":"loss";
              const dayClass=item.isLoss?"loss":"profit";
              return (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
                  <td>{item.avg.toFixed(2)}</td>
                  <td>{item.price.toFixed(2)}</td>
                  <td>{currentVal.toFixed(2)}</td>
                  <td className={profClass}>{(currentVal- item.avg * item.qty).toFixed(2)}</td>
                  <td className={profClass}>{item.net}</td>
                  <td className={dayClass}>{item.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            29,875.<span>55</span>{" "}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            31,428.<span>95</span>{" "}
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5>1,553.40 (+5.20%)</h5>
          <p>P&amp;L</p>
        </div>
      </div>
    </>
  );
};

export default Holdings;
