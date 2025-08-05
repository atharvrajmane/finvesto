import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";

import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import { GeneralContextProvider } from "./GeneralContext";
import GeneralContext from "./GeneralContext";
import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";

const DashboardContent = () => {
  const { isBuyWindowOpen, isSellWindowOpen, selectedStockUID } =
    useContext(GeneralContext);

  return (
    <>
      <WatchList />
      <div className="content">
        <Routes>
          <Route path="/" element={<Summary />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/holdings" element={<Holdings />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/funds" element={<Funds />} />
          <Route path="/apps" element={<Apps />} />
        </Routes>
      </div>

      {/* Conditionally render windows */}
      {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} />}
      {isSellWindowOpen && <SellActionWindow uid={selectedStockUID} />}
    </>
  );
};

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <GeneralContextProvider>
        <DashboardContent />
      </GeneralContextProvider>
    </div>
  );
};

export default Dashboard;
