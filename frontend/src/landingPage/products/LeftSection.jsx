import React from "react";

function LeftSection({
  imageUrl,
  productName,
  productDesc,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
}) {
  return (
    <div className="container p-4 mt-5 pl-5">
      <div className="row mx-5 px-5">
        <div className="col-8 p-3">
          <img src={imageUrl} alt="" />
        </div>
        <div className="col-4 p-3 mt-5">
          <h1 className="fs-2">{productName}</h1>
          <p className="text-muted mt-4" style={{ lineHeight: "1.8" }}>
            {productDesc}
          </p>
          <div className="d-flex gap-5">
            <a href={tryDemo} style={{ textDecoration: "none" }}>
              Try Demo <i class="fa-solid fa-arrow-right"></i>
            </a>
            <a href={learnMore} style={{ textDecoration: "none" }}>
              Learn more <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
          <div className="mt-4 d-flex gap-4">
            <a href={googlePlay}>
              <img src="media/images/googlePlayBadge.svg" alt="" />
            </a>
            <a href={appStore}>
              <img src="media/images/appstoreBadge.svg" alt="" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSection;
