import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import emailjs from 'emailjs-com';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`http://localhost:9999/users?email=${email}`);
      
      if (response.data.length > 0) {
        const user = response.data[0];

        console.log("User found:", user);

        localStorage.setItem("token", "fake-jwt-token");
        localStorage.setItem("role", user.role);
        localStorage.setItem("email", user.email); // Save email to local storage
        login(user.role, user.email); // Pass email to login function
        localStorage.setItem('user', JSON.stringify(user));
        setSuccessMessage("Login successful!");
        setError("");
        if (user.password === password) {
          localStorage.setItem("token", "fake-jwt-token");
          localStorage.setItem("role", user.role);
          localStorage.setItem("email", user.email);
          localStorage.setItem("userId", user.id); 
          login(user.role, user.email, user.id);
          setSuccessMessage("Login successful!");
          setError("");
          
          setTimeout(() => {
            if (user.role === "admin") {
              navigate("/admin");
            } else if (user.role === "shipper") {
              navigate("/shipper");
            } else {
              navigate("/pro");
            }
          }, 500);
        } else {
          setError("Invalid email or password");
          setSuccessMessage("");
        }

      } else {
        setError("No user found with this email.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError("An error occurred. Please try again.");
      setSuccessMessage("");
    }
  };
  

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:9999/users?email=${email}`);
      if (response.data.length > 0) {
        const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        
        const emailParams = {
          to_email: email,
          otp: generatedOTP,
        };
        await emailjs.send(
          'service_3aexhrc',
          'template_b1bghvq',
          emailParams,
          '5jh3QPW6T52yhGzN4'
        );
        
        await axios.patch(`http://localhost:9999/users/${response.data[0].id}`, { otp: generatedOTP });
        
        setOtpSent(true);
        setSuccessMessage("OTP sent to your email!");
      } else {
        setError("No user found with this email.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setError("Failed to send OTP. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:9999/users?email=${email}`);
      if (response.data.length > 0) {
        const user = response.data[0];
        if (user.otp === otp) {
          await axios.patch(`http://localhost:9999/users/${user.id}`, { 
            password: newPassword,
            otp: null
          });
          setSuccessMessage("Password reset successful!");
          setShowForgotPassword(false);
        } else {
          setError("Invalid OTP. Please try again.");
        }
      } else {
        setError("No user found with this email.");
      }
    } catch (error) {
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="body"   >
      <div className="container" >
        <div className="row justify-content-center">
          <div className="inner-wrap col">
            <h2>{showForgotPassword ? "Reset Password" : "Login"}</h2>
            {!showForgotPassword ? (
              <form id="form" className="form" onSubmit={handleLogin}>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    placeholder="Email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password:</label>
                  <input
                    type="password"
                    placeholder="Password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {successMessage && (
                  <p style={{ color: "green" }}>{successMessage}</p>
                )}
                <div className="form-group">
                  <button
                    className="btn form-control btn-success"
                    type="submit"
                    style={{ backgroundColor: "black", color: "white" }}
                  >
                    Login
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={otpSent ? handleResetPassword : handleForgotPassword}>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    placeholder="Email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {otpSent && (
                  <>
                    <div className="form-group">
                      <label>OTP:</label>
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        className="form-control"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>New Password:</label>
                      <input
                        type="password"
                        placeholder="New Password"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {successMessage && (
                  <p style={{ color: "green" }}>{successMessage}</p>
                )}
                <div className="form-group">
                  <button
                    className="btn form-control btn-success"
                    type="submit"
                    style={{ backgroundColor: "black", color: "white" }}
                  >
                    {otpSent ? "Reset Password" : "Send OTP"}
                  </button>
                </div>
              </form>
            )}
            <div className="text-center">
              {!showForgotPassword ? (
                <>
                  <p>
                    <a href="#" onClick={() => setShowForgotPassword(true)}>Forgot Password?</a>
                  </p>
                  <p>
                    Not a member? <Link to="/signup">Register</Link>
                  </p>
                </>
              ) : (
                <p>
                  <a href="#" onClick={() => setShowForgotPassword(false)}>Back to Login</a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <br></br>
    </div>
  );
};

export default Login;
