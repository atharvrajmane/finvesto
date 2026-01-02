import "./Menu.css";
import { NavLink } from "react-router-dom";

export default function Menu() {
  return (
    <div className="container-fluid m-1 d-flex justify-content-between">
      <div className="kiteogo">
        <img
          src="https://kite.zerodha.com/static/images/kite-logo.svg"
          className="img-fluid kiteLogo mt-2"
          alt="Kite Logo"
        />
      </div>

      <div className="menubar">
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive ? "nav-link active highlightElement" : "nav-link"
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/orders"
                    className={({ isActive }) =>
                      isActive ? "nav-link active highlightElement" : "nav-link"
                    }
                  >
                    Orders
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/holdings"
                    className={({ isActive }) =>
                      isActive ? "nav-link active highlightElement" : "nav-link"
                    }
                  >
                    Holdings
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/funds"
                    className={({ isActive }) =>
                      isActive ? "nav-link active highlightElement" : "nav-link"
                    }
                  >
                    Funds
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/charts"
                    className={({ isActive }) =>
                      isActive ? "nav-link active highlightElement" : "nav-link"
                    }
                  >
                    Charts
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
