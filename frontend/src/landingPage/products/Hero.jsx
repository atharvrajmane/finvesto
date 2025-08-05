import React from "react";

function Hero() {
  return (
    <div className="container p-4 mt-5 mb-5 border-bottom">
      <div className="row text-center mt-5 pb-5">
        <h1 className="mt-5" style={{ fontSize: "44px" }}>
          Zerodha Products
        </h1>
        <h5 className="mt-2 text-muted">
          Sleek, modern, and intuitive trading platforms
        </h5>
        <p className="mt-3 text-muted pb-5">
          Check out our{" "}
          <a href="" style={{ textDecoration: "none" }}>
            investment offerings <i class="fa-solid fa-arrow-right"></i>
          </a>
        </p>
      </div>
    </div>
  );
}

export default Hero;
