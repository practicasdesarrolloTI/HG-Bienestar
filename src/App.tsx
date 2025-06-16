// src/App.tsx
import React, { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout"
import LoginPage from "./pages/LogInPage"
import SurveyTable from "./pages/SurveyTable"
import MedicationsTable from "./pages/MedicationsTable"
import MastersPage from "./pages/MastersPage"

type UserType = {
  username: string;
  mail: string;
  role: string;
  userId: string;
  // Puedes agregar más campos aquí si tu objeto usuario los tiene
};  


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("auth") === "true"
  })

  const [user, setUser] = useState<UserType | null>(() => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  });

  // const [userRole, setUserRole] = useState<string | null>(() => {
  //   const userStr = localStorage.getItem("user")
  //   if (userStr) {
  //     const user = JSON.parse(userStr)
  //     return user.role || null
  //   }
  //   return null
  // })

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
              <LoginPage setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
            )
          }
        />

        <Route
          path="/encuestas"
          element={
            isAuthenticated && user ? (
              <Layout user={user}>
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
            isAuthenticated && user ? (
              <Layout user={user}>
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
            isAuthenticated && user?.role === "admin" ? (
              <Layout user={user}>
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
