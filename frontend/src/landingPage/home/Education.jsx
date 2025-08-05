import React from "react";

function Education() {
  return (
    <div className="container px-5 pb-5">
      <div className="row pb-5">
        <div className="col-6 px-5">
          <img src="/media/images/index-education.svg" alt="" />
        </div>
        <div className="col-6 p-5">
          <h1 className="fs-2 pb-4">Free and open market education</h1>
          <p>
            Varsity, the largest online stock market education book in the world
            covering everything from the basics to advanced trading.
          </p>
          <a href="" className="text-decoration-none">Varsity &nbsp;<i class="fa-solid fa-arrow-right"></i></a>
          <p className="pt-5">
            TradingQ&A, the most active trading and investment community in
            India for all your market related queries.
          </p>
          <a href="" className="text-decoration-none">TradingQ&A &nbsp;<i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </div>
    </div>
  );
}

export default Education;
