import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../Components/Navbar.css";
import { useUser } from "../context/UserContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useUser();
  const location = useLocation();

  const scrollToSection = (id) => {
    const section = document.querySelector(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setMenuOpen(false);
    }
  };

  const isHomePage = location.pathname === "/";

  return (
    <nav className="home-navbar navbar navbar-expand-lg fixed-top shadow-sm">
      <div className="container">
        {/* === Logo === */}
        {isHomePage ? (
          <button
            className="navbar-brand"
            onClick={() => scrollToSection(".hero-section")}
          >
            BookLoop
          </button>
        ) : (
          <NavLink
            to="/"
            className="navbar-brand"
            onClick={() => setMenuOpen(false)}
          >
            BookLoop
          </NavLink>
        )}

        {/* === Mobile toggle === */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* === Nav Links === */}
        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {!user ? (
              <>
                {isHomePage && (
                  <>
                    <li className="nav-item mx-2">
                      <button
                        className="nav-link"
                        onClick={() => scrollToSection("#how-it-works")}
                      >
                        How It Works
                      </button>
                    </li>
                    <li className="nav-item mx-2">
                      <button
                        className="nav-link"
                        onClick={() => scrollToSection("#features")}
                      >
                        Features
                      </button>
                    </li>
                    <li className="nav-item mx-2">
                      <button
                        className="nav-link"
                        onClick={() => scrollToSection("#about")}
                      >
                        About
                      </button>
                    </li>
                  </>
                )}
                <li className="nav-item mx-2">
                  <NavLink
                    to="/register"
                    className="btn-primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    Join Now
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                {[
                  { to: "/", label: "Home" },
                  { to: "/listings", label: "Listings" },
                  { to: "/request", label: "Request" },
                  { to: "/upload", label: "Upload" },
                  { to: "/profile", label: "Profile" },
                ].map((link) => (
                  <li className="nav-item mx-2" key={link.to}>
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `nav-link${isActive ? " active" : ""}`
                      }
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
