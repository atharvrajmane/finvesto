import React from "react";
import ColPrice from "./ColPrice";

function Hero() {
  return (
    <div className="container p-4 mt-5 mb-5">
      <div className="row text-center mt-5 pt-5">
        <h1 style={{ fontSize: "275%" }}>Charges</h1>
        <p className="text-muted mt-2 fs-5 mb-5">List of all charges and taxes</p>
        <div className="d-flex mt-3 mx-auto px-5 pt-5">
        <ColPrice
          imgUrl="media/images/pricing-eq.svg"
          heading="Free equity delivery"
          describtion="All equity delivery investments (NSE, BSE), are absolutely free — ₹ 0 brokerage."
        />
        <ColPrice
          imgUrl="media/images/other-trades.svg"
          heading="Intraday and F&O trades"
          describtion="Flat ₹ 20 or 0.03% (whichever is lower) per executed order on intraday trades across equity, currency, and commodity trades. Flat ₹20 on all option trades."
        />
        <ColPrice
          imgUrl="media/images/pricing-eq.svg"
          heading="Free direct MF"
          describtion="All direct mutual fund investments are absolutely free — ₹ 0 commissions & DP charges."
        />
        </div>
      </div>
    </div>
  );
}

export default Hero;
