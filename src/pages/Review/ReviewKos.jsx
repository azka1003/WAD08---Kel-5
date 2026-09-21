import { useState, useEffect } from 'react';
// Mengimpor 3 Reusable Components milik kelompokmu sekaligus
import Navbar from '../../components/Navbar';
import CardWrapper from '../../components/CardWrapper';
import Button from '../../components/Button';

const ReviewKos = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Penghuni 1',
      date: '10 Maret 2026',
      rating: 5,
      comment: 'Fasilitas kos sangat lengkap, bersih, dan lingkungan tenang sekali.'
    },
    {
      id: 2,
      name: 'Penghuni 2',
      date: '15 Februari 2026',
      rating: 4,
      comment: 'Kamar mandi dalam bersih, penjaga kos juga ramah dan responsif.'
    }
  ]);

  const [inputName, setInputName] = useState('');
  const [inputComment, setInputComment] = useState('');
  const [selectedRating, setSelectedRating] = useState(0); 
  const [hoverRating, setHoverRating] = useState(0);       
  const [averageRating, setAverageRating] = useState(4.5);

 
  useEffect(() => {
    if (reviews.length === 0) {
      setAverageRating(0);
      return;
    }
    const totalStars = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = totalStars / reviews.length;
    setAverageRating(Math.round(average * 10) / 10);
  }, [reviews]); 

  
  const handleSubmitReview = (e) => {
    e.preventDefault(); 

    if (!inputName.trim() || !inputComment.trim() || selectedRating === 0) {
      alert('Mohon isi nama, ulasan, dan berikan rating bintang terlebih dahulu!');
      return;
    }

    const newReview = {
      id: Date.now(), 
      name: inputName,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      rating: selectedRating,
      comment: inputComment
    };

    setReviews([newReview, ...reviews]);
    setInputName('');
    setInputComment('');
    setSelectedRating(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">

      <Navbar isLoggedIn={true} role="pemilik" />

      <main className="max-w-3xl mx-auto px-4 py-6 md:py-10">
        
        <CardWrapper className="flex flex-col gap-6 md:gap-8 md:p-8">
          
          {/* Header Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Reviews & Ratings</h2>
            <p className="text-xs text-gray-400 mt-0.5">Ulasan asli dari para penghuni</p>
          </div>

          {/* Score Card Section */}
          <div className="bg-emerald-50/40 border border-emerald-100/70 p-4 md:p-5 rounded-xl flex items-center gap-4 md:gap-5">
            <div className="text-center">
              <span className="text-3xl md:text-4xl font-extrabold text-emerald-600 block leading-none">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-[10px] text-gray-400 mt-1 block">dari 5 poin</span>
            </div>
            
            <div className="w-px h-10 bg-emerald-200/50"></div>
            
            <div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star} 
                    className={`material-icons text-base ${star <= Math.round(averageRating) ? 'text-amber-400' : 'text-gray-200'}`}
                  >
                    {star <= Math.round(averageRating) ? 'star' : 'star_border'}
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-400 mt-1 block font-medium">
                Berdasarkan {reviews.length} ulasan aktif
              </span>
            </div>
          </div>

          {/* Form Tulis Ulasan */}
          <form onSubmit={handleSubmitReview} className="border border-gray-100 p-4 md:p-5 rounded-xl bg-gray-50/50 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tulis Ulasan</h3>
            
            {/* Input Nama */}
            <div>
              <label className="text-[11px] font-medium text-gray-400 block mb-1.5">Nama Lengkap</label>
              <input 
                type="text" 
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Masukkan nama kamu..." 
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-gray-700 transition"
              />
            </div>
            
            {/* Input Rating Bintang */}
            <div>
              <label className="text-[11px] font-medium text-gray-400 block mb-1.5">Berikan Rating Bintang</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="material-icons text-xl transition duration-150 cursor-pointer hover:scale-110 text-gray-300 focus:outline-none"
                    style={{ color: star <= (hoverRating || selectedRating) ? '#fbbf24' : '#e5e7eb' }}
                  >
                    {star <= (hoverRating || selectedRating) ? 'star' : 'star_border'}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Deskripsi */}
            <div>
              <label className="text-[11px] font-medium text-gray-400 block mb-1.5">Ulasan Pengalaman</label>
              <textarea 
                rows="3" 
                value={inputComment}
                onChange={(e) => setInputComment(e.target.value)}
                placeholder="Ceritakan pengalaman kamu disini..." 
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-gray-700 leading-relaxed transition resize-none"
              />
            </div>

            
            <div className="text-right">
              <Button variant="emerald">
                Kirim Ulasan
              </Button>
            </div>
          </form>

          {/* Daftar Komentar */}
          <div className="flex flex-col gap-1">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Semua Komentar</h3>
            
            {reviews.map((review) => (
              <div key={review.id} className="p-4 border-b border-gray-100 last:border-0 flex flex-col gap-1.5 bg-gray-50/20 rounded-xl mb-2">
                <div className="flex justify-between items-center">
                  <strong className="text-xs font-bold text-gray-800">{review.name}</strong>
                  <span className="text-[10px] text-gray-400 font-medium">{review.date}</span>
                </div>
                
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star} 
                      className={`material-icons text-sm ${star <= review.rating ? 'text-amber-400' : 'text-gray-200'}`}
                    >
                      {star <= review.rating ? 'star' : 'star_border'}
                    </span>
                  ))}
                </div>
                
                <p className="text-xs text-gray-600 leading-relaxed mt-1">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>

        </CardWrapper>
      </main>
    </div>
  );
};

export default ReviewKos;