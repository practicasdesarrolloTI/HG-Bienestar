import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ClipboardListIcon,
  PillIcon,
  SettingsIcon,
  MenuIcon,
  UserIcon,
  BellIcon,
  LogOutIcon,
} from "lucide-react";
import logo from '../assets/logomecuidoconletra.png'
import "../styles/Layout.css";

interface LayoutProps {
  userRole: string;
  children: React.ReactNode;
}

type NavItem = {
  id: "encuestas" | "medicamentos" | "maestros";
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  path: string;
};

export const Layout: React.FC<LayoutProps> = ({ userRole, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const getRolNombre = (rol: string) => {
    return rol === "admin" ? "Administrador" : "Usuario";
};

  /** Construye la lista de navegación, ocultando maestros si el rol no es admin */
  const navItems: NavItem[] = [
    {
      id: "encuestas",
      label: "Encuestas",
      icon: ClipboardListIcon,
      path: "/encuestas",
    },
    {
      id: "medicamentos",
      label: "Medicamentos",
      icon: PillIcon,
      path: "/medicamentos",
    },
    // Solo mostramos “Maestros” si es admin
    ...(userRole === "admin"
      ? [
        {
          id: "maestros" as const,
          label: "Maestros",
          icon: SettingsIcon,
          path: "/maestros",
        },
      ]
      : []),
  ];

  /** Función helper que devuelve true si la ruta actual inicia con la ruta del item */
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="layout-container">
      {/*  Sidebar  */}
      <div
        className={`sidebar ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
      >

        {/* Logo + Toggle */}
        <div className="logo-container">
          {sidebarOpen && (
            <div className="logo">
              <img src={logo} alt=" " className="logo-img" />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen((open) => !open)}
            className="toggle-button"
            aria-label="Toggle sidebar"
          >
            <MenuIcon size={20} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="nav">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.id} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-button ${isActive(item.path)
                      ? "nav-button-active"
                      : "nav-button-inactive"
                    }`}
                >
                  <item.icon size={20} />
                  {sidebarOpen && (
                    <span className="nav-label">{item.label}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sección usuario */}
        <div className="user-section">
          {sidebarOpen ? (
            <div className="user-open">
              <div className="user-avatar">
                <UserIcon size={16} />
              </div>
              <div className="user-info">
                <p className="user-name">{getRolNombre(userRole)}</p>
                <p className="user-email">admin@eps.com</p>
              </div>
            </div>
          ) : (
            <div className="user-closed">
              <div className="user-avatar">
                <UserIcon size={16} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========== Contenido Principal ========== */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-inner">
            <h2 className="page-title">
              {location.pathname.startsWith("/encuestas") && "Encuestas"}
              {location.pathname.startsWith("/medicamentos") && "Medicamentos"}
              {location.pathname.startsWith("/maestros") && "Maestros"}
            </h2>
            <div className="header-buttons">
              <button className="header-button" aria-label="Notifications">
                <BellIcon size={20} />
              </button>
              <button className="header-button" aria-label="Log out"
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  localStorage.removeItem("auth");
                  window.location.href = "/";
                }}>
                <LogOutIcon size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Contenido de cada página */}
        <main className="content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
