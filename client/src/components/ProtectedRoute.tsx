import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types/auth';

type Props = {
  children: React.ReactElement;
  role?: Role;
};

const ProtectedRoute: React.FC<Props> = ({ children, role }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to='/login' replace />;

  if (role && user?.role !== role) return <Navigate to='/' replace />;

  return children;
};

export default ProtectedRoute;
