import React, { useState, createContext } from "react";

const GeneralContext = createContext();

export const GeneralContextProvider = ({ children }) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const openBuyWindow = (uid) => {
    setIsBuyWindowOpen(true);
    setIsSellWindowOpen(false);
    setSelectedStockUID(uid);
  };

  const openSellWindow = (uid) => {
    setIsSellWindowOpen(true);
    setIsBuyWindowOpen(false);
    setSelectedStockUID(uid);
  };

  const closeWindows = () => {
    setIsBuyWindowOpen(false);
    setIsSellWindowOpen(false);
    setSelectedStockUID("");
  };

  const triggerRefresh = () => {
    setRefreshFlag((prev) => !prev);
  };

  return (
    <GeneralContext.Provider
      value={{
        isBuyWindowOpen,
        isSellWindowOpen,
        selectedStockUID,
        openBuyWindow,
        openSellWindow,
        closeWindows,
        triggerRefresh,
        setErrorMessage,
        errorMessage,
        refreshFlag,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
