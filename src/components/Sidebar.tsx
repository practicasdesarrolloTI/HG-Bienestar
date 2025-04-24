import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";
import logo from "../assets/logomecuidosinletra.png";

const Sidebar: React.FC = () => {
  return (
    <aside className="zentria-sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Logo Zentria" className="sidebar-logo-img" />
      </div>

      <div className="list-container">
        <nav>
          <ul>
            <li>
              <NavLink to="/" className="nav-link" end>
                Encuestas
              </NavLink>
            </li>
            <li>
              <NavLink to="/medicamentos" className="nav-link">
                Medicamentos
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div className="logout-container">
        <button
          className="nav-link logout-btn"
          onClick={() => {
            localStorage.removeItem("auth");
            window.location.href = "/";
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
