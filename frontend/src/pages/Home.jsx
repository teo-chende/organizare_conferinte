import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Home() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.rolId) {
      case 1: return '/organizator';
      case 2: return '/reviewer';
      case 3: return '/autor';
      default: return '/login';
    }
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Platformă de Organizare Conferințe Științifice</h1>
        <p className="subtitle">
          Gestionează conferințe, submite articole și evaluează lucrări științifice
        </p>

        {isAuthenticated ? (
          <Link to={getDashboardLink()} className="cta-button">
            Mergi la Dashboard
          </Link>
        ) : (
          <div className="cta-buttons">
            <Link to="/login" className="cta-button primary">
              Login
            </Link>
            <Link to="/register" className="cta-button secondary">
              Înregistrare
            </Link>
          </div>
        )}
      </div>

      <div className="features-section">
        <h2>Funcționalități Principale</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🎯</span>
            <h3>Pentru Organizatori</h3>
            <p>Creează conferințe, alocă revieweri și monitorizează articolele submise</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">✍️</span>
            <h3>Pentru Autori</h3>
            <p>Înscrie-te la conferințe, submite articole și primește feedback de la revieweri</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🔍</span>
            <h3>Pentru Revieweri</h3>
            <p>Evaluează articolele alocate automat și oferă feedback constructiv autorilor</p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2>Cum Funcționează?</h2>
        <ol className="steps-list">
          <li>
            <strong>Organizatorul</strong> creează o conferință și alocă revieweri din pool-ul disponibil
          </li>
          <li>
            <strong>Autorul</strong> se înscrie la conferință și submite un articol (format PDF)
          </li>
          <li>
            <strong>Sistemul</strong> alocă automat 2 revieweri pentru fiecare articol
          </li>
          <li>
            <strong>Reviewerii</strong> evaluează articolul și oferă feedback (Acceptat/Revizuire/Respins)
          </li>
          <li>
            <strong>Autorul</strong> poate încărca versiuni noi ale articolului pe baza feedback-ului
          </li>
          <li>
            <strong>Organizatorul</strong> monitorizează progresul și statusul tuturor articolelor
          </li>
        </ol>
      </div>
    </div>
  );
}

export default Home;