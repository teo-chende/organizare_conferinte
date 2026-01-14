import { useEffect, useState } from 'react';
import api from '/src/redux/api'; 

function ArticoleDeReviewed() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stare pentru formularul de review (când dai click pe un articol)
  const [selectedReview, setSelectedReview] = useState(null);
  const [decizie, setDecizie] = useState('acceptat');
  const [comentarii, setComentarii] = useState('');

  // 1. Încărcăm articolele alocate acestui reviewer
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // Backendul tău are ruta: GET /api/reviews/mele
      const response = await api.get('/reviews/mele');
      setReviews(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Eroare la fetch reviews:", err);
      setError('Nu am putut încărca articolele.');
      setLoading(false);
    }
  };

  // 2. Funcția de trimitere a review-ului
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedReview) return;

    try {
      // Backendul are ruta: POST /api/reviews
      await api.post('/reviews', {
        articolId: selectedReview.Articol.id,
        decizie: decizie,
        comentarii: comentarii
      });

      alert('Review trimis cu succes!');
      setSelectedReview(null); // Închidem formularul
      setComentarii('');
      fetchReviews(); // Reîmprospătăm lista
    } catch (err) {
      alert(err.response?.data?.error || 'Eroare la trimiterea review-ului');
    }
  };

  if (loading) return <div className="p-4">Se încarcă articolele...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="review-container p-4">
      <h1 className="text-2xl font-bold mb-4">📝 Articole de Revizuit</h1>

      {reviews.length === 0 ? (
        <p>Nu ai niciun articol alocat momentan.</p>
      ) : (
        <div className="grid gap-4">
          {reviews.map((reviewItem) => (
            <div key={reviewItem.id} className="border p-4 rounded shadow bg-white">
              <h3 className="text-xl font-semibold">{reviewItem.Articol?.titlu}</h3>
              <p className="text-gray-600">Conferința: {reviewItem.Articol?.Conferinta?.titlu}</p>
              <p className="text-sm">Status curent review: 
                <span className={`ml-2 font-bold ${reviewItem.status === 'completat' ? 'text-green-600' : 'text-orange-500'}`}>
                  {reviewItem.status}
                </span>
              </p>

              {/* Buton pentru a deschide formularul de review */}
              {reviewItem.status !== 'completat' && (
                <button 
                  onClick={() => setSelectedReview(reviewItem)}
                  className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Acordă Review
                </button>
              )}
              
              {reviewItem.status === 'completat' && (
                <div className="mt-2 text-sm bg-gray-100 p-2 rounded">
                  <p><strong>Decizia ta:</strong> {reviewItem.decizie}</p>
                  <p><strong>Comentariu:</strong> {reviewItem.comentarii}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Formular Modal / Inline pentru scrierea review-ului */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Review pentru: {selectedReview.Articol.titlu}</h2>
            
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block mb-2 font-semibold">Decizie:</label>
                <select 
                  value={decizie} 
                  onChange={(e) => setDecizie(e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  <option value="acceptat">Acceptat</option>
                  <option value="revizuire">Necesită Revizuire</option>
                  <option value="respins">Respins</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-semibold">Comentarii:</label>
                <textarea 
                  value={comentarii}
                  onChange={(e) => setComentarii(e.target.value)}
                  className="w-full border p-2 rounded h-32"
                  placeholder="Scrie observațiile tale aici..."
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setSelectedReview(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Anulează
                </button>
                <button 
                  type="submit" 
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Trimite Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArticoleDeReviewed;