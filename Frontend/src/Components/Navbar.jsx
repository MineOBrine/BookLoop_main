// src/Components/Navbar.jsx
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../Components/Navbar.css";
import { useUser } from "../context/UserContext";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useUser();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const scrollToSection = (id) => {
    const section = document.querySelector(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setMenuOpen(false);
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/listings", label: "Listings" },
    { to: "/request", label: "Request" },
    { to: "/upload", label: "Upload" },
    { to: "/profile", label: "Profile" },
  ];

  return (
    <nav className="home-navbar">
      <div className="navbar-container">
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

        {/* === Mobile Toggle === */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* === Navigation Links === */}
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          {!user ? (
            <>
              {isHomePage && (
                <>
                  <li>
                    <button
                      className="nav-link"
                      onClick={() => scrollToSection("#how-it-works")}
                    >
                      How It Works
                    </button>
                  </li>
                  <li>
                    <button
                      className="nav-link"
                      onClick={() => scrollToSection("#features")}
                    >
                      Features
                    </button>
                  </li>
                  <li>
                    <button
                      className="nav-link"
                      onClick={() => scrollToSection("#about")}
                    >
                      About
                    </button>
                  </li>
                </>
              )}
              <li>
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
            navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `nav-link${isActive ? " active" : ""}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
