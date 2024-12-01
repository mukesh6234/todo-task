import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Home, Login, Signup } from "./pages";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Protected Route Component

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
  const { user } = useAuth(); // Access the user state from AuthContext

  return (
    <div>
      {/* Show Navbar only when the user is logged in */}
      {user && <Navbar />}
      <div className="container">
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Route - Profile */}
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={<Home />}
                redirectTo="/login" // Redirect to login if not authenticated
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
