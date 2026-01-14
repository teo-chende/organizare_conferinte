import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticole, uploadVersiune } from '../../redux/slices/articoleSlice';

function ArticoleleMe() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { articole, loading } = useSelector((state) => state.articole);

  const [uploadState, setUploadState] = useState({});

  useEffect(() => {
    dispatch(fetchArticole({ autorId: user?.id }));
  }, [dispatch, user]);

  const handleUploadVersiune = async (articolId) => {
    const fileInput = document.getElementById(`file-${articolId}`);
    const file = fileInput.files[0];
    
    if (!file) {
      alert('Selectează un fișier PDF');
      return;
    }

    const formData = new FormData();
    formData.append('document', file);
    formData.append('comentariiAutor', uploadState[articolId]?.comentarii || '');

    await dispatch(uploadVersiune({ articolId, formData }));
    
    // Reset
    fileInput.value = '';
    setUploadState({ ...uploadState, [articolId]: {} });
    
    dispatch(fetchArticole({ autorId: user?.id }));
  };

  const articoleleMe = articole.filter(a => a.autorId === user?.id);

  return (
    <div className="page-container">
      <h1>Articolele Mele</h1>

      {loading && <p>Se încarcă...</p>}

      {articoleleMe.length === 0 ? (
        <p className="empty-state">Nu ai articole submise.</p>
      ) : (
        <div className="articole-list">
          {articoleleMe.map(articol => (
            <div key={articol.id} className="articol-card">
              <div className="articol-header">
                <h3>{articol.titlu}</h3>
                <span className={`status-badge status-${articol.status}`}>
                  {articol.status}
                </span>
              </div>

              <p className="articol-info">
                Conferință: {articol.Conferintum?.titlu}
              </p>
              <p className="articol-info">
                Versiuni: {articol.VersiuneArticols?.length || 0}
              </p>

              {articol.Reviews && articol.Reviews.length > 0 && (
                <div className="reviews-section">
                  <h4>Reviews ({articol.Reviews.length})</h4>
                  {articol.Reviews.map(review => (
                    <div key={review.id} className="review-item">
                      <p><strong>Reviewer:</strong> {review.reviewer?.username}</p>
                      {review.decizie && (
                        <>
                          <p><strong>Decizie:</strong> {review.decizie}</p>
                          <p><strong>Comentarii:</strong> {review.comentarii}</p>
                        </>
                      )}
                      {!review.decizie && (
                        <p className="status-pending">⏳ În așteptare</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Upload versiune nouă */}
              {articol.status === 'revizuire' && (
                <div className="upload-section">
                  <h4> Încarcă Versiune Nouă</h4>
                  <input
                    type="file"
                    id={`file-${articol.id}`}
                    accept=".pdf"
                  />
                  <textarea
                    placeholder="Comentarii pentru revieweri..."
                    value={uploadState[articol.id]?.comentarii || ''}
                    onChange={(e) => setUploadState({
                      ...uploadState,
                      [articol.id]: { comentarii: e.target.value }
                    })}
                    rows="2"
                  />
                  <button 
                    onClick={() => handleUploadVersiune(articol.id)}
                    className="btn-primary"
                  >
                    Upload
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArticoleleMe;