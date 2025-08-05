import React from "react";

function RaiseTicket({ icon, heading, a1, a2, a3, a4, a5, a6 }) {
  return (
    <div className="col-4 mt-4 px-2">
      <h3 className="fs-5 text-muted px-2" style={{ fontSize: "12px" }}>
        <i class={icon}></i> {heading}
      </h3>
      <div className="px-5 mt-4" style={{ fontSize: "15px" }}>
        <p className="mb-2">
          <a href="" style={{ textDecoration: "none" }}>
            {a1}
          </a>
        </p>
        <p className="mb-2">
          <a href="" style={{ textDecoration: "none" }}>
            {a2}
          </a>
        </p>
        <p className="mb-2">
          <a href="" style={{ textDecoration: "none" }}>
            {a3}
          </a>
        </p>
        <p className="mb-2">
          <a href="" style={{ textDecoration: "none" }}>
            {a4}
          </a>
        </p>
        <p className="mb-2">
          <a href="" style={{ textDecoration: "none" }}>
            {a5}
          </a>
        </p>
        <p>
          <a href="" style={{ textDecoration: "none" }}>
            {a6}
          </a>
        </p>
      </div>
    </div>
  );
}

export default RaiseTicket;
