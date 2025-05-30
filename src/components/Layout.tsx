import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import "../styles/Layout.css";

interface LayoutProps {
  children: React.ReactNode;
  userRole: string;
}

const Layout: React.FC<LayoutProps> = ({ children, userRole }) => {
  return (
    <div className="layout-container">
      <div className="layout-content">
        <Sidebar userRole={userRole}/>
        <div className="layout-main">
          <Header />
          <div className="layout-body">{children}</div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
