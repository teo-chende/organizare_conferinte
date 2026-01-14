import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConferintaById, alocaRevieweri } from '../../redux/slices/conferinteSlice';
import { fetchRevieweri } from '/src/redux/slices/utilizatorSlice';

function ManageConferinta() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { conferintaCurenta } = useSelector((state) => state.conferinte);
  const { revieweri } = useSelector((state) => state.utilizatori);
  
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [showAlocareForm, setShowAlocareForm] = useState(false);

  useEffect(() => {
    dispatch(fetchConferintaById(id));
    dispatch(fetchRevieweri());
  }, [dispatch, id]);

  const handleAlocaRevieweri = async () => {
    if (selectedReviewers.length === 0) {
      alert('Selectează cel puțin un reviewer');
      return;
    }

    await dispatch(alocaRevieweri({ 
      conferintaId: id, 
      reviewerIds: selectedReviewers 
    }));
    
    setSelectedReviewers([]);
    setShowAlocareForm(false);
    dispatch(fetchConferintaById(id));
  };

  const toggleReviewer = (reviewerId) => {
    setSelectedReviewers(prev => 
      prev.includes(reviewerId) 
        ? prev.filter(id => id !== reviewerId)
        : [...prev, reviewerId]
    );
  };

  if (!conferintaCurenta) return <p>Se încarcă...</p>;

  const revieweriAlocati = conferintaCurenta.revieweri || [];
  const revieweriDisponibili = revieweri.filter(
    r => !revieweriAlocati.some(ra => ra.id === r.id)
  );

  return (
    <div className="manage-container">
      <h1>{conferintaCurenta.titlu}</h1>
      <p className="description">{conferintaCurenta.descriere}</p>

      {/* Revieweri */}
      <div className="section">
        <div className="section-header">
          <h2>Revieweri Alocați ({revieweriAlocati.length})</h2>
          <button 
            onClick={() => setShowAlocareForm(!showAlocareForm)} 
            className="btn-secondary"
          >
            {showAlocareForm ? 'Anulează' : ' Alocă Revieweri'}
          </button>
        </div>

        {showAlocareForm && (
          <div className="alocare-form">
            <h3>Selectează Revieweri</h3>
            {revieweriDisponibili.length === 0 ? (
              <p>Nu mai sunt revieweri disponibili</p>
            ) : (
              <>
                <div className="reviewer-list">
                  {revieweriDisponibili.map(reviewer => (
                    <label key={reviewer.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedReviewers.includes(reviewer.id)}
                        onChange={() => toggleReviewer(reviewer.id)}
                      />
                      {reviewer.username} ({reviewer.email})
                    </label>
                  ))}
                </div>
                <button onClick={handleAlocaRevieweri} className="btn-primary">
                  Alocă Selectați
                </button>
              </>
            )}
          </div>
        )}

        <div className="reviewer-cards">
          {revieweriAlocati.map(reviewer => (
            <div key={reviewer.id} className="reviewer-card">
              <strong>{reviewer.username}</strong>
              <p>{reviewer.email}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Articole */}
      <div className="section">
        <h2>Articole Submise ({conferintaCurenta.Articols?.length || 0})</h2>
        {conferintaCurenta.Articols && conferintaCurenta.Articols.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Titlu</th>
                <th>Autor</th>
                <th>Status</th>
                <th>Versiuni</th>
              </tr>
            </thead>
            <tbody>
              {conferintaCurenta.Articols.map(articol => (
                <tr key={articol.id}>
                  <td>{articol.titlu}</td>
                  <td>{articol.autor?.username}</td>
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
        ) : (
          <p className="empty-state">Niciun articol încă</p>
        )}
      </div>
    </div>
  );
}

export default ManageConferinta;