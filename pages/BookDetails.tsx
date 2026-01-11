
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockFirestore } from '../services/mockFirebase';
import { geminiService } from '../services/geminiService';
import { BookListing, User } from '../types';
import { DIVISIONS, DISTRICTS, UPAZILAS } from '../constants';

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookListing | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const data = await mockFirestore.getListing(id);
      if (data) {
        setBook(data);
        const sellerData = await mockFirestore.getUserProfile(data.sellerId);
        setSeller(sellerData || null);
        
        // Fetch AI insights
        geminiService.getBookInsights(data.title, data.author).then(setInsights);
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="p-20 text-center text-black/50">Loading book details...</div>;
  if (!book) return <div className="p-20 text-center text-black/50">Book not found.</div>;

  const division = DIVISIONS.find(d => d.id === book.location.divisionId)?.name;
  const district = DISTRICTS.find(d => d.id === book.location.districtId)?.name;
  const upazila = UPAZILAS.find(u => u.id === book.location.upazilaId)?.name;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-black/50 hover:text-accent mb-8 font-bold transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Back to browse
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Images & Insights */}
        <div className="lg:col-span-5 space-y-6">
          <div className="aspect-[4/5] bg-white rounded-3xl overflow-hidden shadow-2xl border border-accent/10">
            <img 
              src={`https://picsum.photos/seed/${book.id}/800/1000`} 
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>

          {insights && (insights.trim() !== "") && (
            <div className="bg-accent/5 p-6 rounded-2xl border border-accent/20">
              <h3 className="flex items-center gap-2 text-lg font-bold text-black mb-3">
                <span className="text-xl">✨</span> AI Book Insights
              </h3>
              <div className="text-black/80 text-sm whitespace-pre-line leading-relaxed">
                {insights}
              </div>
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-accent text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg shadow-accent/20">
                {book.condition}
              </span>
              <span className="bg-white px-4 py-1.5 rounded-full text-xs font-bold text-black/40 border border-accent/10 uppercase tracking-widest">
                {book.subject}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-2 leading-tight">{book.title}</h1>
            <p className="text-xl text-black/60 italic">by {book.author}</p>
          </div>

          <div className="flex items-center gap-6 py-6 border-y border-accent/10">
            <div>
              <p className="text-sm text-black/40 font-bold uppercase tracking-wider mb-1">Price</p>
              <p className="text-4xl font-bold text-black">৳{book.price}</p>
            </div>
            <div className="h-10 w-px bg-accent/10 mx-2"></div>
            <div>
              <p className="text-sm text-black/40 font-bold uppercase tracking-wider mb-1">Location</p>
              <p className="text-lg font-bold text-black/80">{upazila}, {district}, {division}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-black">Description</h3>
            <p className="text-black/80 leading-relaxed text-lg">{book.description}</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg border border-accent/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-accent">{seller?.displayName[0].toUpperCase()}</span>
              </div>
              <div>
                <p className="text-sm text-black/40 font-bold uppercase tracking-wider">Seller</p>
                <p className="text-xl font-bold text-black">{seller?.displayName}</p>
              </div>
            </div>
            
            <a 
              href={`tel:${book.contactPhone}`}
              className="w-full sm:w-auto bg-accent text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-accent/20 hover:scale-105 transition-transform flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.746 4.477a1 1 0 01-.769 1.134l-2.62.524a15.035 15.035 0 006.831 6.831l.524-2.62a1 1 0 011.134-.769l4.477.746a1 1 0 01.836.986V21a1 1 0 01-1 1h-2.22c-9.11 0-16.5-7.39-16.5-16.5V3z"/></svg>
              {book.contactPhone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
