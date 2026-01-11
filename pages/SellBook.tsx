
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockFirestore, mockAuth } from '../services/mockFirebase';
import { geminiService } from '../services/geminiService';
import { DIVISIONS, DISTRICTS, UPAZILAS, BOOK_CONDITIONS } from '../constants';

const SellBook: React.FC = () => {
  const user = mockAuth.getCurrentUser();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    subject: '',
    condition: 'Good' as any,
    price: '',
    contactPhone: '',
    description: '',
  });

  const [location, setLocation] = useState({
    divisionId: '',
    districtId: '',
    upazilaId: '',
  });

  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const filteredDistricts = useMemo(() => 
    DISTRICTS.filter(d => d.divisionId === location.divisionId), [location.divisionId]);

  const filteredUpazilas = useMemo(() => 
    UPAZILAS.filter(u => u.districtId === location.districtId), [location.districtId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.divisionId || !location.districtId || !location.upazilaId) {
      alert("Please select full location");
      return;
    }

    setLoading(true);
    try {
      await mockFirestore.createListing({
        ...formData,
        price: parseFloat(formData.price),
        sellerId: user.uid,
        sellerName: user.displayName,
        location
      });
      setIsSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2500);
    } catch (err) {
      alert("Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  const enhanceWithAI = async () => {
    if (!formData.title || !formData.description) {
      alert("Please enter a title and some basic description first.");
      return;
    }
    setEnhancing(true);
    const enhanced = await geminiService.enhanceDescription(formData.title, formData.author, formData.description);
    setFormData(prev => ({ ...prev, description: enhanced }));
    setEnhancing(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center animate-in fade-in zoom-in-95 duration-700 max-w-md">
          <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-accent/40">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-black mb-4 tracking-tight">Listing Published!</h1>
          <p className="text-black/50 font-bold uppercase tracking-widest text-xs mb-8">
            Your book is now live on the public marketplace. Anyone can see it on the home page.
          </p>
          <div className="flex gap-1.5 justify-center">
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-accent/5 p-10 md:p-14 border border-accent/10">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black text-black mb-3 tracking-tight">List Your Book</h1>
          <p className="text-black/40 font-bold uppercase tracking-widest text-[10px]">Reach students across Bangladesh instantly</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-black/40 uppercase tracking-widest ml-1">Book Title *</label>
              <input 
                required
                className="w-full bg-accent/5 border-2 border-transparent rounded-2xl py-4 px-6 focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white transition-all text-black font-bold"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Higher Chemistry 1st Paper"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-black/40 uppercase tracking-widest ml-1">Author *</label>
              <input 
                required
                className="w-full bg-accent/5 border-2 border-transparent rounded-2xl py-4 px-6 focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white transition-all text-black font-bold"
                value={formData.author}
                onChange={e => setFormData({...formData, author: e.target.value})}
                placeholder="e.g. Dr. Saroj Kanti Singha Hazari"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-black/40 uppercase tracking-widest ml-1">Subject/Category *</label>
              <input 
                required
                className="w-full bg-accent/5 border-2 border-transparent rounded-2xl py-4 px-6 focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white transition-all text-black font-bold"
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                placeholder="e.g. Science, Fiction, Engineering"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-black/40 uppercase tracking-widest ml-1">Condition *</label>
              <select 
                className="w-full bg-accent/5 border-2 border-transparent rounded-2xl py-4 px-6 focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white transition-all text-black font-bold"
                value={formData.condition}
                onChange={e => setFormData({...formData, condition: e.target.value as any})}
              >
                {BOOK_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-black/40 uppercase tracking-widest ml-1">Price (BDT) *</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-black/40">৳</span>
                <input 
                  required
                  type="number"
                  className="w-full bg-accent/5 border-2 border-transparent rounded-2xl py-4 pl-12 pr-6 focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white transition-all text-black font-bold"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  placeholder="250"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-black/40 uppercase tracking-widest ml-1">Contact Phone *</label>
              <input 
                required
                className="w-full bg-accent/5 border-2 border-transparent rounded-2xl py-4 px-6 focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white transition-all text-black font-bold"
                value={formData.contactPhone}
                onChange={e => setFormData({...formData, contactPhone: e.target.value})}
                placeholder="01XXXXXXXXX"
              />
            </div>
          </div>

          <div className="space-y-6 pt-10 border-t border-accent/10">
            <h3 className="font-black text-black uppercase tracking-widest text-xs">Pickup Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <select 
                required
                className="bg-accent/5 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent text-black font-bold"
                value={location.divisionId}
                onChange={e => setLocation({divisionId: e.target.value, districtId: '', upazilaId: ''})}
              >
                <option value="">Division</option>
                {DIVISIONS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <select 
                required
                disabled={!location.divisionId}
                className="bg-accent/5 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent disabled:opacity-50 text-black font-bold"
                value={location.districtId}
                onChange={e => setLocation({...location, districtId: e.target.value, upazilaId: ''})}
              >
                <option value="">District</option>
                {filteredDistricts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <select 
                required
                disabled={!location.districtId}
                className="bg-accent/5 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent disabled:opacity-50 text-black font-bold"
                value={location.upazilaId}
                onChange={e => setLocation({...location, upazilaId: e.target.value})}
              >
                <option value="">Upazila</option>
                {filteredUpazilas.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-black/40 uppercase tracking-widest ml-1">Description *</label>
              <button 
                type="button"
                onClick={enhanceWithAI}
                disabled={enhancing}
                className="text-[10px] flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white font-black uppercase tracking-widest hover:bg-neutral-800 transition-all disabled:opacity-50 shadow-lg shadow-accent/20"
              >
                {enhancing ? 'Writing...' : '✨ Enhance Description'}
              </button>
            </div>
            <textarea 
              required
              rows={5}
              className="w-full bg-accent/5 border-2 border-transparent rounded-[2rem] py-5 px-8 focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white transition-all text-black font-medium leading-relaxed"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Tell buyers about the quality, highlight useful notes, etc..."
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-6 rounded-3xl font-black text-xl shadow-2xl hover:bg-neutral-800 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-70 mt-10"
          >
            {loading ? 'Publishing Your Book...' : 'Publicly List This Book'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellBook;
