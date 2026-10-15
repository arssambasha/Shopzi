import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useContext(AuthContext);
  return userInfo ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
