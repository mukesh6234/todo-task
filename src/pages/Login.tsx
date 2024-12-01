import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Card, FormGroup, InputGroup } from "@blueprintjs/core";

const Login: React.FC = () => {
  // Profile data state
  const [authData, setAuthData] = useState<{
  
    email: string;
    password: string;
  }>({
   
    email: "",
    password: "",
  });

  // Destructuring for cleaner JSX
  const {  email, password } = authData;
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="auth-container">
      <Card elevation={2} style={{ width: 400 }}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <FormGroup label="Email" labelFor="email-input">
            <InputGroup
              id="email-input"
              placeholder="Enter your email"
              type="email"
              value={email}
              name="email"
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup label="Password" labelFor="password-input">
            <InputGroup
              id="password-input"
              placeholder="Enter your password"
              type="password"
              value={password}
              name="password"
              onChange={handleChange}
            />
          </FormGroup>
          <Button intent="primary" text="Login" type="submit" />
        </form>
      </Card>
    </div>
  );
};

export default Login;
