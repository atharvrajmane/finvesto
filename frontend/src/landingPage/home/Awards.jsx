import React from "react";

function Awards() {
  return (
    <div className="container mt-5 pb-5">
      <div className="row px-5">
        <div className="col-5 ps-5">
          <h1 className="pb-4 fs-2">Trust with confidence</h1>

          <h3 className="pt-4 fs-5" style={{fontSize:"32px"}}>Customer-first always</h3>
          <p className="text-muted">
            That's why 1.5+ crore customers trust Zerodha with ₹4.5+ lakh crores
            of equity investments and contribute to 15% of daily retail exchange
            volumes in India.
          </p>

          <h3 className="pt-4 fs-5">No spam or gimmicks</h3>
          <p className="text-muted">
            No gimmicks, spam, "gamification", or annoying push notifications.
            High quality apps that you use at your pace, the way you like.
          </p>

          <h3 className="pt-4 fs-5">The Zerodha universe</h3>
          <p className="text-muted">
            Not just an app, but a whole ecosystem. Our investments in 30+
            fintech startups offer you tailored services specific to your needs.
          </p>

          <h3 className="pt-4 fs-5">Do better with money</h3>
          <p className="text-muted">
            With initiatives like Nudge and Kill Switch, we don't just
            facilitate transactions, but actively help you do better with your
            money.
          </p>
        </div>
        <div className="col-7">
          <img
            src="media/images/ecosystem.png"
            alt="Not found"
            className="img-fluid px-4 pb-3"
          />
          <p className="text-center">
            <a href="" className="px-4 text-decoration-none">
              Explore our products <i class="fa-solid fa-arrow-right"></i>
            </a>
            <a href="" className="px-4 text-decoration-none">
              Try Kite demo <i class="fa-solid fa-arrow-right"></i>
            </a>
          </p>
        </div>
      </div>
      <div
        className="row mt-4 pb-5"
      >
        <img
          src="media/images/press-logos.png"
          alt="Not Found"
          style={{ width: "700px" }}
          className="mx-auto pb-5"
        />
      </div>
    </div>
  );
}

export default Awards;
