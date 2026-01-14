import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getRoleName = (rolId) => {
    const roles = { 1: 'Organizator', 2: 'Reviewer', 3: 'Autor' };
    return roles[rolId] || '';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Conferințe Științifice
        </Link>

        <div className="nav-menu">
          {isAuthenticated ? (
            <>
              <span className="nav-user">
                {user?.username} ({getRoleName(user?.rolId)})
              </span>
              
              {user?.rolId === 1 && (
                <Link to="/organizator" className="nav-link">Dashboard</Link>
              )}
              {user?.rolId === 2 && (
                <Link to="/reviewer" className="nav-link">Dashboard</Link>
              )}
              {user?.rolId === 3 && (
                <Link to="/autor" className="nav-link">Dashboard</Link>
              )}
              
              <button onClick={handleLogout} className="nav-button logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-button">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
