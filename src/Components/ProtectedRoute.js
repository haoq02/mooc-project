import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext'; // Đảm bảo đường dẫn đúng

const ProtectedRoute = ({ component: Component, allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (allowedRoles && !allowedRoles.includes(role)) {
      navigate('/');
    }
  }, [isAuthenticated, role, navigate, allowedRoles]);

  if (!isAuthenticated || (allowedRoles && !allowedRoles.includes(role))) {
    return null; // Hoặc một cái gì đó khác trong khi đang chuyển hướng
  }

  return <Component />;
};

export default ProtectedRoute;
