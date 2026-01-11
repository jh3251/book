
import React, { useState, useEffect, useMemo } from 'react';
import { mockFirestore } from '../services/mockFirebase';
import { BookListing } from '../types';
import { DIVISIONS, DISTRICTS, UPAZILAS } from '../constants';
import BookCard from '../components/BookCard';

const Home: React.FC = () => {
  const [listings, setListings] = useState<BookListing[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [divisionId, setDivisionId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [upazilaId, setUpazilaId] = useState('');

  const fetchListings = () => {
    mockFirestore.getListings().then(data => {
      setListings(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchListings();
    
    // Listen for real-time updates when someone lists a new book
    window.addEventListener('listingsChange', fetchListings);
    return () => window.removeEventListener('listingsChange', fetchListings);
  }, []);

  const filteredDistricts = useMemo(() => 
    DISTRICTS.filter(d => d.divisionId === divisionId), [divisionId]);

  const filteredUpazilas = useMemo(() => 
    UPAZILAS.filter(u => u.districtId === districtId), [districtId]);

  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                            item.author.toLowerCase().includes(search.toLowerCase()) ||
                            item.description.toLowerCase().includes(search.toLowerCase());
      const matchesDivision = !divisionId || item.location.divisionId === divisionId;
      const matchesDistrict = !districtId || item.location.districtId === districtId;
      const matchesUpazila = !upazilaId || item.location.upazilaId === upazilaId;
      
      return matchesSearch && matchesDivision && matchesDistrict && matchesUpazila;
    });
  }, [listings, search, divisionId, districtId, upazilaId]);

  return (
    <div className="pb-20">
      {/* Hero Search Section */}
      <section className="bg-accent/5 pt-12 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-6 leading-tight">
            Find Your Next <span className="text-accent underline decoration-wavy decoration-2 underline-offset-8">Favorite Read</span>
          </h1>
          <p className="text-lg text-black/70 mb-10 max-w-2xl mx-auto font-medium">
            Join the public marketplace where students across Bangladesh buy and sell textbooks every day.
          </p>

          <div className="relative max-w-2xl mx-auto group">
            <input 
              type="text" 
              placeholder="Search by title, author, or subject..."
              className="w-full pl-12 pr-4 py-5 rounded-2xl shadow-xl border-none focus:ring-2 focus:ring-accent group-hover:shadow-2xl transition-all text-lg text-black font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-black/30 group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Filter Toolbar */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-accent/10 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full space-y-1">
            <label className="text-xs font-bold text-black/50 ml-2 uppercase tracking-widest">Division</label>
            <select 
              className="w-full bg-accent/5 border-none rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-accent text-black font-bold"
              value={divisionId}
              onChange={(e) => {
                setDivisionId(e.target.value);
                setDistrictId('');
                setUpazilaId('');
              }}
            >
              <option value="">All Divisions</option>
              {DIVISIONS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div className="flex-1 w-full space-y-1">
            <label className="text-xs font-bold text-black/50 ml-2 uppercase tracking-widest">District</label>
            <select 
              disabled={!divisionId}
              className="w-full bg-accent/5 border-none rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-accent disabled:opacity-50 text-black font-bold"
              value={districtId}
              onChange={(e) => {
                setDistrictId(e.target.value);
                setUpazilaId('');
              }}
            >
              <option value="">All Districts</option>
              {filteredDistricts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div className="flex-1 w-full space-y-1">
            <label className="text-xs font-bold text-black/50 ml-2 uppercase tracking-widest">Upazila/Thana</label>
            <select 
              disabled={!districtId}
              className="w-full bg-accent/5 border-none rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-accent disabled:opacity-50 text-black font-bold"
              value={upazilaId}
              onChange={(e) => setUpazilaId(e.target.value)}
            >
              <option value="">All Upazilas</option>
              {filteredUpazilas.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          
          <button 
            onClick={() => {setSearch(''); setDivisionId(''); setDistrictId(''); setUpazilaId('');}}
            className="md:self-end h-[54px] px-8 bg-black text-white rounded-xl hover:bg-neutral-800 transition-colors font-bold uppercase tracking-widest text-xs"
          >
            Reset
          </button>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black text-black">Public Marketplace</h2>
            <p className="text-black/40 font-bold uppercase tracking-widest text-[10px] mt-1">Recently Listed across Bangladesh</p>
          </div>
          <div className="bg-accent/10 px-4 py-2 rounded-full">
            <p className="text-accent font-black text-xs uppercase tracking-widest">{filteredListings.length} Active Listings</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="animate-pulse bg-gray-50 rounded-[2rem] h-[480px]"></div>
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {filteredListings.map(book => (
              <div key={book.id} className="relative group">
                {Date.now() - book.createdAt < 3600000 * 24 && (
                  <div className="absolute top-4 left-4 z-20 bg-accent text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg animate-pulse">
                    New
                  </div>
                )}
                <BookCard book={book} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-accent/5 rounded-[3rem] border-2 border-dashed border-accent/10">
            <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
              <svg className="w-12 h-12 text-accent/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-3xl font-black mb-3 text-black">No matches found</h3>
            <p className="text-black/40 font-bold max-w-sm mx-auto uppercase tracking-widest text-xs">Try searching for something else or clearing your filters</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
