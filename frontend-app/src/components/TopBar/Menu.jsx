import "./Menu.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext"; 
import { motion, AnimatePresence } from "framer-motion";

export default function Menu() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuGroupRef = useRef(null); 

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout(); 
    navigate("/login");
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuGroupRef.current && !menuGroupRef.current.contains(e.target)) {
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : "U";
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsProfileOpen(false); // Force profile closed
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsMobileMenuOpen(false); // Force mobile menu closed
  };

  return (
    <div className="container-fluid d-flex justify-content-between align-items-center py-2 px-3 position-relative">
      {}
      <div className="brand-logo">
        <img
          src="/logo2.png" 
          className="img-fluid"
          alt="Finvesto Logo"
          style={{ maxHeight: "35px" }}
        />
      </div>

      {}
      <div className="d-flex align-items-center gap-3" ref={menuGroupRef}>
        <nav className="navbar navbar-expand-lg p-0">
          
          {}
          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            onClick={toggleMobileMenu}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {}
          <div className={`navbar-collapse ${isMobileMenuOpen ? "mobile-dropdown-active" : "collapse"}`}>
            <ul className="navbar-nav gap-2">
              {["Dashboard", "Orders", "Holdings", "Funds", "Charts"].map((item) => (
                <li className="nav-item" key={item}>
                  <NavLink
                    to={item === "Dashboard" ? "/" : `/${item.toLowerCase()}`}
                    onClick={() => setIsMobileMenuOpen(false)} // Close menu after clicking a link
                    className={({ isActive }) =>
                      isActive ? "nav-link active premium-link" : "nav-link premium-link"
                    }
                  >
                    {item}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {}
        <div className="profile-wrapper">
          <button
            className="profile-avatar-btn"
            onClick={toggleProfileMenu}
          >
            {userInitial}
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="premium-dropdown"
              >
                <div className="dropdown-header">
                  <div className="dropdown-avatar">{userInitial}</div>
                  <div className="dropdown-user-info">
                    <h6>{user?.username}</h6>
                    <p>{user?.email}</p>
                  </div>
                </div>
                <hr className="dropdown-divider" />
                <div className="dropdown-body">
                  <div className="wallet-balance">
                    <span>Buying Power</span>
                    <strong>$100,000.00</strong> 
                  </div>
                </div>
                <hr className="dropdown-divider" />
                <button className="dropdown-logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}