import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/LogInPage";
import RegisterPage from "./pages/RegisterPage";
import SurveyTable from "./pages/SurveyTable";
import MedicationsTable from "./pages/MedicationsTable";
import UserManagement from "./pages/UserManagement";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("auth") === "true";
  });

  // Guardar el estado en localStorage
  useEffect(() => {
    localStorage.setItem("auth", isAuthenticated ? "true" : "false");
  }, [isAuthenticated]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          isAuthenticated
            ? <Navigate to="/encuestas" replace />
            : <LoginPage setIsAuthenticated={setIsAuthenticated} />
        } />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/encuestas" element={
          isAuthenticated
            ? <Layout><SurveyTable /></Layout>
            : <Navigate to="/" replace />
        } />

        <Route path="/medicamentos" element={
          isAuthenticated
            ? <Layout><MedicationsTable /></Layout>
            : <Navigate to="/" replace />
        } />
        <Route path="/maestros" element={
          isAuthenticated
            ? <Layout><UserManagement /></Layout>
            : <Navigate to="/" replace />
        } />
      </Routes>
    </Router>
  );
};

export default App;
