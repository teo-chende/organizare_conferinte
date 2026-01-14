import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../../redux/slices/authSlice';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await dispatch(login(formData));
    
    if (login.fulfilled.match(result)) {
      // Redirecționare către dashboard-ul corespunzător
      const rolId = result.payload.user.rolId;
      if (rolId === 1) navigate('/organizator');
      else if (rolId === 2) navigate('/reviewer');
      else if (rolId === 3) navigate('/autor');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2> Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="exemplu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Parolă</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Se autentifică...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Nu ai cont? <Link to="/register">Înregistrează-te</Link></p>
        </div>

        <div className="demo-credentials">
          <h4>Conturi de test:</h4>
          <p> Organizator: org1@conferinte.ro</p>
          <p> Reviewer: reviewer1@conferinte.ro</p>
          <p> Autor: autor1@conferinte.ro</p>
          <p> Parolă: password123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;