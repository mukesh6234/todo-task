import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import { BrowserRouter as Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { Home, Login, Signup } from "../pages";


const MainContent: React.FC = () => {
  const { user } = useAuth(); // Access the user state from AuthContext

  return (
    <>
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

          <Route path="/" element={<h1>Home Page</h1>} />
        </Routes>
      </div>
    </>
  );
};

export default MainContent;
