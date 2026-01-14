import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.rolId !== requiredRole) {
    return (
      <div className="access-denied">
        <h2>Acces Interzis</h2>
        <p>Nu ai permisiunile necesare pentru această pagină.</p>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;