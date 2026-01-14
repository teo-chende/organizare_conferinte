import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchArticole } from '../../redux/slices/articoleSlice';
import { fetchConferinte } from '../../redux/slices/conferinteSlice';

function DashboardAutor() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { articole } = useSelector((state) => state.articole);
  const { conferinte } = useSelector((state) => state.conferinte);

  useEffect(() => {
    dispatch(fetchArticole({ autorId: user?.id }));
    dispatch(fetchConferinte());
  }, [dispatch, user]);

  const articoleleMe = articole.filter(a => a.autorId === user?.id);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard Autor</h1>
        <Link to="/autor/submit-articol" className="btn-primary">
          Submit Articol
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{articoleleMe.length}</h3>
          <p>Articole Submise</p>
        </div>
        <div className="stat-card">
          <h3>{conferinte.length}</h3>
          <p>Conferințe Disponibile</p>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Articolele Mele</h2>
          <Link to="/autor/articolele-mele" className="btn-secondary">
            Vezi Toate
          </Link>
        </div>

        {articoleleMe.length === 0 ? (
          <p className="empty-state">Nu ai submis niciun articol încă.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Titlu</th>
                <th>Conferință</th>
                <th>Status</th>
                <th>Versiuni</th>
              </tr>
            </thead>
            <tbody>
              {articoleleMe.slice(0, 5).map(articol => (
                <tr key={articol.id}>
                  <td>{articol.titlu}</td>
                  <td>{articol.Conferintum?.titlu}</td>
                  <td>
                    <span className={`status-badge status-${articol.status}`}>
                      {articol.status}
                    </span>
                  </td>
                  <td>{articol.VersiuneArticols?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default DashboardAutor;