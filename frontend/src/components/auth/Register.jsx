import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../../redux/slices/authSlice';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    rolId: 3 // Default: Autor
  });

  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);

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
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    // Validări
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Parolele nu coincid');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Parola trebuie să aibă minim 6 caractere');
      return;
    }

    const { confirmPassword, ...dataToSend } = formData;
    
    const result = await dispatch(register(dataToSend));
    
    if (register.fulfilled.match(result)) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2> Înregistrare</h2>
        
        {(error || localError) && (
          <div className="error-message">{error || localError}</div>
        )}
        
        {success && (
          <div className="success-message">
             Cont creat cu succes! Redirecționare către login...
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={30}
              placeholder="nume_utilizator"
            />
          </div>

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
              minLength={6}
              placeholder="Minim 6 caractere"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmă Parola</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Reintroduceți parola"
            />
          </div>

          <div className="form-group">
            <label htmlFor="rolId">Rol</label>
            <select
              id="rolId"
              name="rolId"
              value={formData.rolId}
              onChange={handleChange}
            >
              <option value={1}>Organizator</option>
              <option value={2}>Reviewer</option>
              <option value={3}>Autor</option>
            </select>
            <small className="form-help">
              Alege rolul corespunzător activității tale în platformă
            </small>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading || success}
          >
            {loading ? 'Se înregistrează...' : 'Înregistrare'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Ai deja cont? <Link to="/login">Autentifică-te</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;