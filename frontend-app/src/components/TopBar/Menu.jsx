import "./Menu.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const logoUrl = "logo.png";

export default function Menu() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  // --------------------
  // LOGOUT HANDLER
  // --------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // --------------------
  // CLOSE DROPDOWN ON OUTSIDE CLICK
  // --------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="container-fluid m-1 d-flex justify-content-between align-items-center">
      
      {/* LOGO */}
      <div className="kiteogo">
        <img
          src="logo2.png"
          className="img-fluid kiteLogo mt-2"
          alt="Kite Logo"
        />
      </div>

      {/* MENU + PROFILE */}
      <div className="menubar d-flex align-items-center">
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

        {/* PROFILE DROPDOWN (RIGHT SIDE) */}
        <div className="profile-wrapper" ref={dropdownRef}>
          <button
            className="profile-btn"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            👤 {user?.username}
          </button>

          {isProfileOpen && (
            <div className="profile-dropdown">
              <div className="profile-name">{user?.username}</div>
              <hr />
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
