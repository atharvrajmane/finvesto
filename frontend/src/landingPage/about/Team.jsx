import React from "react";

function Team() {
  return (
    <div className="container mt-5 pt-5 px-5">
      <div className="row">
        <h2 className="text-center">People</h2>
      </div>

      <div className="row mt-5 px-5 mx-5" style={{ lineHeight: "1.8" }}>
        <div className="col-5 pt-5">
          <img
            src="media/images/nithinKamath.jpg"
            alt="Not Found"
            style={{ borderRadius: "100%", width: "70%" }}
            className="d-block mx-auto"
          />
          <h5 className="text-center pt-4" >Nithin Kamath</h5>
          <p className="text-center pt-4">Founder, CEO</p>
        </div>
        <div className="col-7 pt-5 px-5 ">
          <p>
            Nithin bootstrapped and founded Zerodha in 2010 to overcome the
            hurdles he faced during his decade long stint as a trader. Today,
            Zerodha has changed the landscape of the Indian broking industry.
          </p>
          <p>
            He is a member of the SEBI Secondary Market Advisory Committee
            (SMAC) and the Market Data Advisory Committee (MDAC).
          </p>
          <p>Playing basketball is his zen.</p>
          <p>
            Connect on{" "}
            <a href="" style={{ textDecoration: "none" }}>
              Homepage
            </a>{" "}
            /{" "}
            <a href="" style={{ textDecoration: "none" }}>
              TradingQnA
            </a>{" "}
            /{" "}
            <a href="" style={{ textDecoration: "none" }}>
              Twitter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Team;
