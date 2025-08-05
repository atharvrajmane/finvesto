import React from "react";

function RightSection({ imageUrl, productName, productDesc, learnMore }) {
  return (
    <div className="container mlx-5 px-5">
      <div className="row mx-5 px-5">
        <div className="col-4 mt-5 pt-5">
          <h1 className="fs-2 mt-5 pt-5 p">{productName}</h1>
          <p className="text-muted mt-4" style={{ lineHeight: "1.8" }}>
            {productDesc}
          </p>
          <a href={learnMore} style={{ textDecoration: "none" }}>
            Learn more <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
        <div
          className={
            productName === "Kite Connect API"
              ? "col-8 ps-5 mt-5 pt-4"
              : "col-8 ps-5"
          }
        >
          <img
            src={imageUrl}
            alt=""
            className="ms-5"
            style={
              productName === "Kite Connect API"
                ? {
                    width: "100%",
                    height: "400px",
                    objectFit: "cover",
                    marginTop: "40px",
                  }
                : { width: "100%" }
            }
          />
        </div>
      </div>
    </div>
  );
}

export default RightSection;
