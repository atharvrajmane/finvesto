import React from "react";
import TicketCard from "./TicketCard";

function RaiseTicket() {
  return (
    <div className="container px-4 mt-5 mb-5 ">
      <div className="row mx-4 px-5">
        <h2 className="fs-5 text-muted">
          To create a ticket, select a relevant topic
        </h2>
        <TicketCard
          icon={"fa-solid fa-circle-plus"}
          heading={"Account Opening"}
          a1={"Resident individual"}
          a2={"Minor"}
          a3={"Non Resident Indian (NRI)"}
          a4={"Company, Partnership, HUF and LLP"}
          a5={"Glossary"}
        />
        <TicketCard
          icon={"fa-solid fa-user"}
          heading={"Your Zerodha Account"}
          a1={"Your Profile"}
          a2={"Account modification"}
          a3={"Client Master Report (CMR) and Depository Participant (DP)"}
          a4={"Nomination"}
          a5={"Transfer and conversion of securities"}
        />
        <TicketCard
          icon={"fa-solid fa-chart-simple"}
          heading={"Kite"}
          a1={"IPO"}
          a2={"Trading FAQs"}
          a3={"Margin Trading Facility (MTF) and Margins"}
          a4={"Charts and orders"}
          a5={"Alerts and Nudges"}
          a6={"General"}
        />
        <TicketCard
          icon={"fa-solid fa-credit-card"}
          heading={"Funds"}
          a1={"Add money"}
          a2={"Withdraw money"}
          a3={"Add bank accounts"}
          a4={"eMandates"}
        />
        <TicketCard
          icon={"fa-solid fa-circle-notch"}
          heading={"Console"}
          a1={"Portfolio"}
          a2={"Corporate actions"}
          a3={"Funds statement"}
          a4={"Reports"}
          a5={"Profile"}
          a6={"Segments"}
        />
        <TicketCard
          icon={"fa-solid fa-coins"}
          heading={"Coin"}
          a1={"Mutual funds"}
          a2={"National Pension Scheme (NPS)"}
          a3={"Features on Coin"}
          a4={"Payments and Orders"}
          a5={"General"}
        />
      </div>
    </div>
  );
}

export default RaiseTicket;
