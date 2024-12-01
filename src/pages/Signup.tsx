import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, FormGroup, InputGroup } from "@blueprintjs/core";

const Signup: React.FC = () => {
  // Profile data state
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

  // Destructuring for cleaner JSX
  const { firstName, lastName, email, password } = profileData;

  // Auth context and navigation
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup(email, password);
    navigate("/");
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="auth-container">
      <Card elevation={2} style={{ width: 400 }}>
        <h2>Create New Account</h2>
        <form onSubmit={handleSubmit}>
          {/* First Name */}
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
          {/* Last Name */}
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
          {/* Email */}
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
          {/* Password */}
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
          {/* Submit Button */}
          <Button intent="primary" text="Sign Up" type="submit" />
        </form>
        {/* Login Link */}
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
