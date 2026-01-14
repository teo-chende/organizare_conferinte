import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchConferinte } from '../../redux/slices/conferinteSlice';
import { createArticol, uploadVersiune } from '../../redux/slices/articoleSlice';

function SubmitArticol() {
  const [formData, setFormData] = useState({
    titlu: '',
    conferintaId: ''
  });
  const [file, setFile] = useState(null);
  const [comentarii, setComentarii] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { conferinte } = useSelector((state) => state.conferinte);
  const { loading, error } = useSelector((state) => state.articole);

  useEffect(() => {
    dispatch(fetchConferinte());
  }, [dispatch]);

  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    const result = await dispatch(createArticol(formData));
    
    if (createArticol.fulfilled.match(result)) {
      const articolId = result.payload.id;
      
      // Dacă e upload fișier
      if (file) {
        const formData = new FormData();
        formData.append('document', file);
        formData.append('comentariiAutor', comentarii);
        
        await dispatch(uploadVersiune({ articolId, formData }));
      }
      
      navigate('/autor/articolele-mele');
    }
  };

  return (
    <div className="form-container">
      <h1>Submit Articol Nou</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmitInfo} className="form-card">
        <div className="form-group">
          <label htmlFor="titlu">Titlu Articol *</label>
          <input
            type="text"
            id="titlu"
            value={formData.titlu}
            onChange={(e) => setFormData({ ...formData, titlu: e.target.value })}
            required
            placeholder="ex: Analiza algoritmilor de deep learning"
          />
        </div>

        <div className="form-group">
          <label htmlFor="conferintaId">Conferință *</label>
          <select
            id="conferintaId"
            value={formData.conferintaId}
            onChange={(e) => setFormData({ ...formData, conferintaId: e.target.value })}
            required
          >
            <option value="">-- Selectează conferința --</option>
            {conferinte.map(conf => (
              <option key={conf.id} value={conf.id}>
                {conf.titlu}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="document">Document PDF (opțional - poate fi adăugat mai târziu)</label>
          <input
            type="file"
            id="document"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file && <p className="file-name">{file.name}</p>}
        </div>

        {file && (
          <div className="form-group">
            <label htmlFor="comentarii">Comentarii (opțional)</label>
            <textarea
              id="comentarii"
              value={comentarii}
              onChange={(e) => setComentarii(e.target.value)}
              rows="3"
              placeholder="Comentarii pentru revieweri..."
            />
          </div>
        )}

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/autor')} className="btn-secondary">
            Anulează
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Se trimite...' : 'Submit Articol'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SubmitArticol;