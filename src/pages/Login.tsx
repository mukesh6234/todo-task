import React, { useCallback, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, FormGroup, InputGroup } from "@blueprintjs/core";
import { api } from "../api/MakeRequest";
import { showErrorToast, showSuccessToast } from "../components/Toaster";
import { catchBlockError } from "../utils/helper";
import LoadingBackdrop from "../components/LoadingBackdrop";

interface LoginResponse {
  message: string;
  token: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const Login: React.FC = () => {
  const [authData, setAuthData] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const { email, password } = authData;
  const { saveUser, isSubmitting, setIsSubmitting } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authData.email || !authData.password) {
      showErrorToast("Invalid credentials");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await api.put<LoginResponse>(`/auth/login`, authData);
      const { token, user } = response;
      showSuccessToast(response.message);
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("userData", JSON.stringify(user));
      saveUser(user);
      navigate("/");
    } catch (err) {
      catchBlockError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  return (
    <div className="auth-container">
      {isSubmitting && <LoadingBackdrop />}
      <Card elevation={2} style={{ width: 400 }}>
        <h2>Welcome back!</h2>
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
          <Button intent="primary" text="Login" type="submit" icon={"log-in"} />
        </form>
        <div style={{ marginTop: "10px" }}>
          Don't have an account?{" "}
          <Link to="/signup" className="bp3-button bp3-minimal">
            Signup
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
