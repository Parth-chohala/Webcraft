import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import AuthForm from "./pages/Authpage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import LandingPage from "./pages/LandingPage";
import Editor from "./pages/Editor";
import FormPage from "./pages/CreateprojectForm";
import UserProfile from "./pages/UserProfile";
import { ToastContainer } from "react-toastify";
import { useTheme } from "./contexts/ThemeContext";
import TransferConfirmPage from "./pages/Transferproject";

function App() {
  const { theme } = useTheme();
  return (
    <ThemeProvider>
      <Router>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          className={`${theme === "dark" ? "dark-toast" : "light-toast"}`}
          theme={theme === "dark" ? "dark" : "light"}
        />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <LandingPage />
              </>
            }
          />
          <Route
            path="/auth"
            element={
              <>
                <Header />
                <AuthForm />
              </>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Header />
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transferconfirmation/:token"
            element={<TransferConfirmPage />}
          />
          <Route
            path="/create-project"
            element={
              <ProtectedRoute>
                <Header />
                <FormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Header />
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor/:id"
            element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
