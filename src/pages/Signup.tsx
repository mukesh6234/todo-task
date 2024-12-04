import React, { useCallback, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, FormGroup, InputGroup } from "@blueprintjs/core";
import { api } from "../api/MakeRequest";
import { showErrorToast, showSuccessToast } from "../components/Toaster";
import { catchBlockError } from "../utils/helper";
import LoadingBackdrop from "../components/LoadingBackdrop";

interface SignResponse {
  message: string;
  token: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const Signup: React.FC = () => {
  const [profileData, setProfileData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const { isSubmitting, setIsSubmitting } = useAuth();

  const { firstName, lastName, email, password } = profileData;

  const { saveUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();     
    if (!firstName || !lastName || !email || !password) {
      showErrorToast("Invalid credentials");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await api.post<SignResponse>(
        `/auth/signup`,
        profileData
      );
      const { token, user } = response;
      saveUser(user);
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("userData", JSON.stringify(user));
      showSuccessToast(response.message);
      navigate("/");
    } catch (err) {
      catchBlockError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  return (
    <div className="auth-container">
      {isSubmitting && <LoadingBackdrop />}
      <Card elevation={2} style={{ width: 400 }}>
        <h2>Create New Account</h2>
        <form onSubmit={handleSubmit}>
          <FormGroup label="First Name" labelFor="first-name-input">
            <InputGroup
              id="first-name-input"
              placeholder="Enter your first name"
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup label="Last Name" labelFor="last-name-input">
            <InputGroup
              id="last-name-input"
              placeholder="Enter your last name"
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup label="Email" labelFor="email-input">
            <InputGroup
              id="email-input"
              placeholder="Enter your email"
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup label="Password" labelFor="password-input">
            <InputGroup
              id="password-input"
              placeholder="Enter your password"
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
            />
          </FormGroup>
          <Button intent="primary" text="Sign Up" type="submit" />
        </form>
        <div style={{ marginTop: "10px" }}>
          Already have an account?{" "}
          <Link to="/login" className="bp3-button bp3-minimal">
            Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
