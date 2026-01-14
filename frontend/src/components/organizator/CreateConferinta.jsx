import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createConferinta } from '../../redux/slices/conferinteSlice';

function CreateConferinta() {
  const [formData, setFormData] = useState({
    titlu: '',
    descriere: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.conferinte);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createConferinta(formData));
    
    if (createConferinta.fulfilled.match(result)) {
      navigate(`/organizator/conferinta/${result.payload.id}`);
    }
  };

  return (
    <div className="form-container">
      <h1> Conferință Nouă</h1>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label htmlFor="titlu">Titlu Conferință *</label>
          <input
            type="text"
            id="titlu"
            value={formData.titlu}
            onChange={(e) => setFormData({ ...formData, titlu: e.target.value })}
            required
            placeholder="ex: Conferința Internațională de AI 2026"
          />
        </div>

        <div className="form-group">
          <label htmlFor="descriere">Descriere</label>
          <textarea
            id="descriere"
            value={formData.descriere}
            onChange={(e) => setFormData({ ...formData, descriere: e.target.value })}
            rows="4"
            placeholder="Descriere pe scurt a conferinței..."
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/organizator')} className="btn-secondary">
            Anulează
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Se creează...' : 'Creează Conferință'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateConferinta;
