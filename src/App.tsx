import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Home, Login, Signup } from "./pages";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <MainContent />
      </Router>
    </AuthProvider>
  );
};

const MainContent: React.FC = () => {
  return (
    <>
      <div className="container">
        <Routes>
          <Route
            path="/signup"
            element={<PublicRoute element={<Signup />} redirectTo="/" />}
          />
          <Route
            path="/login"
            element={<PublicRoute element={<Login />} redirectTo="/" />}
          />
          <Route
            path="/"
            element={<ProtectedRoute element={<Home />} redirectTo="/login" />}
          />
        </Routes>
      </div>
    </>
  );
};

export default App;
