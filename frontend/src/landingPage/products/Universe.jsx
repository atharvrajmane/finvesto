import React from "react";
import UniverseCard from "./UniversCard";

function Universe() {
  return (
    <div className="container mt-5 pt-5">
      <div className="row mx-5 px-3 pe-5">
        <h1 className="text-center" style={{ fontSize: "32px" }}>
          The Zerodha Universe
        </h1>
        <p className="text-center mt-3">
          Extend your trading and investment experience even further with our
          partner platforms
        </p>
        <div className="row mx-5 px-1 pe-5">
          <UniverseCard
            imageUrl={"media/images/zerodhaFundhouse.png"}
            description1={"Our asset management venture"}
            description2={"that is creating simple andtransparent index"}
            description3={"funds to help you save for your goals."}
          />
          <UniverseCard
            imageUrl={"media/images/sensibullLogo.svg"}
            description1={"Options trading platform that lets you"}
            description2={"create strategies, analyze positions, and examine"}
            description3={"data points like open interest, FII/DII, and more."}
          />
          <UniverseCard
            imageUrl={"media/images/tijori.svg"}
            description1={"Investment research platform"}
            description2={"that offers detailed insights on stocks,"}
            description3={"sectors, supply chains, and more."}
          />
        </div>
        <div className="row mx-5 px-1 pe-5">
          <UniverseCard
            imageUrl={"media/images/streakLogo.png"}
            description1={"Systematic trading platform"}
            description2={"that allows you to create and backtest"}
            description3={"strategies without coding."}
          />
          <UniverseCard
            imageUrl={"media/images/smallcaseLogo.png"}
            description1={"Thematic investing platform"}
            description2={"that helps you invest in diversified"}
            description3={"baskets of stocks on ETFs."}
          />
          <UniverseCard
            imageUrl={"media/images/dittoLogo.png"}
            description1={"Personalized advice on life"}
            description2={"and health insurance. No spam"}
            description3={"and no mis-selling."}
          />
        </div>
        <button
          className="p-2 btn btn-primary fs-5 mt-4 mb-5"
          style={{ width: "15%", margin: "0 auto" }}
        >
          Sign up for free
        </button>
      </div>
    </div>
  );
}

export default Universe;
