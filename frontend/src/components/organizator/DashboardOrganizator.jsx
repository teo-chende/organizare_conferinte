import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchConferinte } from '../../redux/slices/conferinteSlice';

function DashboardOrganizator() {
  const dispatch = useDispatch();
  const { conferinte, loading } = useSelector((state) => state.conferinte);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchConferinte());
  }, [dispatch]);

  const conferinteleMe = conferinte.filter(c => c.organizatorId === user?.id);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard Organizator</h1>
        <Link to="/organizator/conferinta-noua" className="btn-primary">
          Conferință Nouă
        </Link>
      </div>

      {loading && <p>Se încarcă...</p>}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{conferinteleMe.length}</h3>
          <p>Conferințe Organizate</p>
        </div>
        <div className="stat-card">
          <h3>{conferinteleMe.reduce((sum, c) => sum + (c.Articols?.length || 0), 0)}</h3>
          <p>Total Articole</p>
        </div>
      </div>

      <div className="section">
        <h2>Conferințele Mele</h2>
        {conferinteleMe.length === 0 ? (
          <p className="empty-state">Nu ai creat nicio conferință încă.</p>
        ) : (
          <div className="cards-grid">
            {conferinteleMe.map(conferinta => (
              <div key={conferinta.id} className="card">
                <h3>{conferinta.titlu}</h3>
                <p className="card-description">{conferinta.descriere}</p>
                <div className="card-stats">
                  <span>{conferinta.revieweri?.length || 0} revieweri</span>
                  <span> {conferinta.Articols?.length || 0} articole</span>
                </div>
                <Link to={`/organizator/conferinta/${conferinta.id}`} className="btn-secondary">
                  Gestionează
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardOrganizator;
