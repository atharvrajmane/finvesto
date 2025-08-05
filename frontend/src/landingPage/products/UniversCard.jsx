import React from "react";

function UniverseCard({imageUrl,description1,description2,description3}) {
  return (
    <div className="col-4 py-5 text-center ">
      <img src={imageUrl} alt="" style={{ width: "200px", height: "60px", objectFit: "contain"}} />
      <p
        className="text-muted text-center px-3 mb-0 mt-2"
        style={{ fontSize: "80%" }}
      >
        {description1}
      </p>
      <p
        className="text-muted text-center px-3 mb-0 mt-0"
        style={{ fontSize: "80%" }}
      >
        {description2}
      </p>
      <p
        className="text-muted text-center px-3 mb-0 mt-0"
        style={{ fontSize: "80%" }}
      >
        {description3}
      </p>
    </div>
  );
}

export default UniverseCard;
