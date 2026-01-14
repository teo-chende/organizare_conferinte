import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticolById, submitReview } from '../../redux/slices/articoleSlice';

function ReviewForm() {
  const { articolId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { articolCurent, loading } = useSelector((state) => state.articole);

  const [reviewData, setReviewData] = useState({
    decizie: '',
    comentarii: ''
  });

  useEffect(() => {
    dispatch(fetchArticolById(articolId));
  }, [dispatch, articolId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reviewData.decizie) {
      alert('Selectează o decizie');
      return;
    }

    const result = await dispatch(submitReview({
      articolId: parseInt(articolId),
      ...reviewData
    }));

    if (submitReview.fulfilled.match(result)) {
      alert('Review submis cu succes!');
      navigate('/reviewer');
    }
  };

  if (loading || !articolCurent) return <p>Se încarcă...</p>;

  return (
    <div className="form-container">
      <h1>🔍 Reviewează Articol</h1>

      <div className="info-card">
        <h2>{articolCurent.titlu}</h2>
        <p><strong>Conferință:</strong> {articolCurent.Conferintum?.titlu}</p>
        <p><strong>Autor:</strong> {articolCurent.autor?.username}</p>
        <p><strong>Versiuni:</strong> {articolCurent.VersiuneArticols?.length || 0}</p>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label htmlFor="decizie">Decizie *</label>
          <select
            id="decizie"
            value={reviewData.decizie}
            onChange={(e) => setReviewData({ ...reviewData, decizie: e.target.value })}
            required
          >
            <option value="">-- Selectează --</option>
            <option value="acceptat">Acceptat</option>
            <option value="revizuire">Necesită Revizuire</option>
            <option value="respins">Respins</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="comentarii">Comentarii *</label>
          <textarea
            id="comentarii"
            value={reviewData.comentarii}
            onChange={(e) => setReviewData({ ...reviewData, comentarii: e.target.value })}
            rows="6"
            required
            placeholder="Feedback detaliat pentru autor..."
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/reviewer')} className="btn-secondary">
            Anulează
          </button>
          <button type="submit" className="btn-primary">
            Trimite Review
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReviewForm;