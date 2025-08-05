import React from "react";

function ColPrice({ imgUrl, heading, describtion}) {
  return (
    <>
      <div className="col-4 p-4">
        <img src={imgUrl} alt="Not Found" className="p-5"/>
        <div>
            <h2 className="fs-3">{heading}</h2>
            <p className="mt-4 text-muted">{describtion}</p>
        </div>
      </div>
    </>
  );
}

export default ColPrice;
