import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navbar as BPNavbar, Button, Alignment } from "@blueprintjs/core";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <BPNavbar>
      <BPNavbar.Group align={Alignment.CENTER}>
        <div style={{ display: "flex", justifyContent: "space-between",alignItems:"center",width:"100%" }}>
          <h2>Welcome, {user?.email}</h2>
          <Button
            className="bp3-minimal"
            intent="danger"
            text="Logout"
            onClick={logout}
            icon="log-out"
          />
        </div>
      </BPNavbar.Group>
    </BPNavbar>
  );
};

export default Navbar;
