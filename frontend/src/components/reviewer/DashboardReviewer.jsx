import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchReviewsMele } from '../../redux/slices/articoleSlice';

function DashboardReviewer() {
  const dispatch = useDispatch();
  const { reviewsMele, loading } = useSelector((state) => state.articole);

  useEffect(() => {
    dispatch(fetchReviewsMele());
  }, [dispatch]);

  const inAsteptare = reviewsMele.filter(r => r.status === 'in_asteptare' || r.status === 'in_progres');
  const completate = reviewsMele.filter(r => r.status === 'completat');

  return (
    <div className="dashboard-container">
      <h1>🔍 Dashboard Reviewer</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{inAsteptare.length}</h3>
          <p>Articole de Reviewat</p>
        </div>
        <div className="stat-card">
          <h3>{completate.length}</h3>
          <p>Reviews Completate</p>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Articole de Reviewat</h2>
          <Link to="/reviewer/articole" className="btn-secondary">
            Vezi Toate
          </Link>
        </div>

        {loading && <p>Se încarcă...</p>}

        {inAsteptare.length === 0 ? (
          <p className="empty-state">Nu ai articole alocate momentan.</p>
        ) : (
          <div className="cards-grid">
            {inAsteptare.map(review => (
              <div key={review.id} className="card">
                <h3>{review.Articol?.titlu}</h3>
                <p>{review.Articol?.Conferintum?.titlu}</p>
                <p>Autor: {review.Articol?.autor?.username}</p>
                <Link 
                  to={`/reviewer/review/${review.articolId}`}
                  className="btn-primary"
                >
                  Reviewează
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardReviewer;
