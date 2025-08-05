import React from "react";

function Hero() {
  return (
    <div style={{ backgroundColor: "#387ed1", width: "100%" }}>
      <div className="container p-4 mt-5 mb-5 ">
        <div className="row mt-5 mx-4 px-5">
          <div className="col-6">
            <a
              href=""
              className="text-white fs-5"
              style={{ textDecoration: "none" }}
            >
              Support Portal
            </a>
          </div>
          <div className="col-6" style={{ textAlign: "end" }}>
            <a
              href=""
              className="text-white border-bottom"
              style={{ textDecoration: "none" }}
            >
              Track tickets
            </a>
          </div>
        </div>
        <div className="row mt-5 mx-4 px-5 text-white mb-5">
          <div className="col-7 ">
            <div>
              <h4 className="fs-4" style={{ lineHeight: "1.3" }}>
                Search for an answer or browse help topics to create a ticket
              </h4>
            </div>
            <div className="input-group mt-4 text-muted">
              <input
                type="text"
                className="form-control ps-4"
                style={{
                  height: "55px",
                  border: "none",
                  boxShadow: "none",
                  outline: "none",
                  color: "black",
                }}
                placeholder="Eg: how do I activate F&O, why is my order getting rejected ..."
              />
              <span
                className="input-group-text text-muted"
                style={{
                  backgroundColor: "white",
                  border: "none",
                  height: "55px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
            </div>
            <div className="d-flex flex-wrap mt-4">
              <a
                href="#"
                className="text-white border-bottom me-3 mb-2"
                style={{ textDecoration: "none", padding: "8px 12px" }}
              >
                Track account opening
              </a>
              <a
                href="#"
                className="text-white border-bottom me-3 mb-2"
                style={{ textDecoration: "none", padding: "8px 12px" }}
              >
                Track segment activation
              </a>
              <a
                href="#"
                className="text-white border-bottom me-3 mb-2"
                style={{ textDecoration: "none", padding: "8px 12px" }}
              >
                Intraday margins
              </a>
              <a
                href="#"
                className="text-white border-bottom me-3 mb-2"
                style={{ textDecoration: "none", padding: "8px 12px" }}
              >
                Kite user manual
              </a>
            </div>
          </div>
          <div className="col-5">
            <div className="fs-5 ps-4" style={{ lineHeight: "1.3" }}>
              Featured
            </div>
            <div className="ps-2">
              <ol className="ps-5">
                <li className="mt-3">
                  <a
                    href=""
                    className="text-white border-bottom"
                    style={{ textDecoration: "none" }}
                  >
                    Exclusion of F&O contracts on 8 securities from August 29,
                    2025
                  </a>
                </li>
                <li className="mt-3">
                  <a href="" className="text-white border-bottom"
                    style={{ textDecoration: "none" }}>
                    Revision in expiry day of Index and Stock derivatives
                    contracts
                  </a>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;