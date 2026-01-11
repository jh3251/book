
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockFirestore, mockAuth } from '../services/mockFirebase';
import { BookListing } from '../types';

const Dashboard: React.FC = () => {
  const user = mockAuth.getCurrentUser();
  const navigate = useNavigate();
  const [listings, setListings] = useState<BookListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    mockFirestore.getUserListings(user.uid).then(data => {
      setListings(data);
      setLoading(false);
    });
  }, [user, navigate]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      await mockFirestore.deleteListing(id);
      setListings(prev => prev.filter(l => l.id !== id));
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-black mb-2">My Bookshelf</h1>
          <p className="text-black/60">Manage your active listings and sales.</p>
        </div>
        <Link to="/sell" className="bg-accent text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-accent/20 hover:scale-105 transition-transform flex items-center gap-2 w-fit">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          List New Book
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="animate-pulse bg-white h-40 rounded-3xl"></div>)}
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map(book => (
            <div key={book.id} className="bg-white rounded-3xl shadow-lg border border-accent/5 overflow-hidden flex flex-col group">
              <div className="flex p-5 gap-4">
                <img 
                  src={`https://picsum.photos/seed/${book.id}/200/250`} 
                  alt={book.title} 
                  className="w-24 h-32 object-cover rounded-xl shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest">{book.subject}</span>
                  <h3 className="font-bold text-black truncate mb-1">{book.title}</h3>
                  <p className="text-xs text-black/60 mb-3 line-clamp-2">{book.description}</p>
                  <p className="text-lg font-bold text-black">৳{book.price}</p>
                </div>
              </div>
              <div className="mt-auto bg-accent/5 p-4 flex items-center justify-between border-t border-accent/10">
                <Link 
                  to={`/books/${book.id}`}
                  className="text-xs font-bold text-black hover:text-accent transition-colors"
                >
                  View Details
                </Link>
                <div className="flex items-center gap-3">
                  <button 
                    className="p-2 text-black/40 hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
                    title="Edit (Mock)"
                    onClick={() => alert("Edit functionality enabled for " + book.title)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(book.id)}
                    className="p-2 text-black/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-accent/40">
           <svg className="w-20 h-20 text-accent/30 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
           <h3 className="text-2xl font-bold mb-2 text-black">You haven't listed any books yet</h3>
           <p className="text-black/60 mb-8">Turn your used books into cash today!</p>
           <Link to="/sell" className="bg-accent text-white px-8 py-4 rounded-2xl font-bold">Start Selling</Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
