import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");

  const login = (userRole, userEmail, id) => {
    localStorage.setItem("token", "fake-jwt-token");
    localStorage.setItem("role", userRole);
    localStorage.setItem("email", userEmail);
    localStorage.setItem("userId", id);
    setIsAuthenticated(true);
    setRole(userRole);
    setEmail(userEmail);
    setUserId(id);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    setRole("");
    setEmail("");
    setUserId("");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, role, email, userId, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
