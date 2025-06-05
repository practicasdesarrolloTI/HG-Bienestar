// src/App.tsx
import React, { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout"
import LoginPage from "./pages/LogInPage"
import SurveyTable from "./pages/SurveyTable"
import MedicationsTable from "./pages/MedicationsTable"
import MastersPage from "./pages/MastersPage"


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("auth") === "true"
  })

  const [userRole, setUserRole] = useState<string | null>(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const user = JSON.parse(userStr)
      return user.role || null
    }
    return null
  })

  // Guardar el estado en localStorage
  useEffect(() => {
    localStorage.setItem("auth", isAuthenticated ? "true" : "false")
  }, [isAuthenticated])

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/encuestas" replace />
            ) : (
              <LoginPage setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />
            )
          }
        />

        <Route
          path="/encuestas"
          element={
            isAuthenticated ? (
              <Layout userRole={userRole ?? ""}>
                <SurveyTable />
              </Layout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/medicamentos"
          element={
            isAuthenticated ? (
              <Layout userRole={userRole ?? ""}>
                <MedicationsTable />
              </Layout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/maestros"
          element={
            isAuthenticated && userRole === "admin" ? (
              <Layout userRole={userRole ?? ""}>
                <MastersPage />
              </Layout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  )
}

export default App
