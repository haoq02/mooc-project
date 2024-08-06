import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import "./Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
    role: "user",
  });
  const [passwordData, setPasswordData] = useState({
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
    let isValid = true;

    // Validation
    if (!formData.fullName) {
      isValid = false;
      validationErrors.fullName = "Full name required";
    }
    if (!formData.email) {
      isValid = false;
      validationErrors.email = "Email required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      isValid = false;
      validationErrors.email = "Email is not valid";
    }
    if (!formData.password) {
      isValid = false;
      validationErrors.password = "Password required";
    } else if (formData.password.length < 6) {
      isValid = false;
      validationErrors.password = "Password must be at least 6 characters";
    }
    if (passwordData.confirmPassword !== formData.password) {
      isValid = false;
      validationErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.address) {
      isValid = false;
      validationErrors.address = "Address required";
    }
    if (!formData.phoneNumber) {
      isValid = false;
      validationErrors.phoneNumber = "Phone number required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      isValid = false;
      validationErrors.phoneNumber = "Phone number must be 10 digits";
    }

    setErrors(validationErrors);

    if (isValid) {
      try {
        const response = await axios.get('http://localhost:9999/users');
        const users = response.data;
        const maxId = users.reduce((max, user) => Math.max(max, parseInt(user.id, 10)), 0);
        const newUserId = (maxId + 1).toString();

        const newUser = {
          ...formData,
          id: newUserId,
        };

        await axios.post('http://localhost:9999/users', newUser);
        setMessage("Registration successful!");
        setFormData({
          fullName: "",
          email: "",
          password: "",
          address: "",
          phoneNumber: "",
          role: "user",
        });
        setPasswordData({
          confirmPassword: "",
        });
      } catch (error) {
        setMessage("Registration failed. Please try again.");
        console.error(error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registration Information</h2>

      {message && <Alert variant={message.includes("failed") ? "danger" : "success"}>{message}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="fullName">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            isInvalid={!!errors.fullName}
          />
          <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
        </Form.Group>
        <br />
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
        </Form.Group>
        <br />
        <Form.Group controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            isInvalid={!!errors.address}
          />
          <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
        </Form.Group>
        <br />
        <Form.Group controlId="phoneNumber">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            isInvalid={!!errors.phoneNumber}
          />
          <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
        </Form.Group>
        <br />
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
        </Form.Group>
        <br />
        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            isInvalid={!!errors.confirmPassword}
          />
          <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
        </Form.Group>
        <br />
        <Button variant="dark" type="submit">
          Register
        </Button>
      </Form>
    </div>
  );
};

export default Signup;
