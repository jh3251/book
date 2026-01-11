
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
      navigate('/dashboard');
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-accent/10">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-black mb-2">List Your Book</h1>
          <p className="text-black/60">Reach thousands of students across Bangladesh.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-black ml-1">Book Title *</label>
              <input 
                required
                className="w-full bg-accent/5 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent text-black"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Higher Chemistry 1st Paper"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-black ml-1">Author *</label>
              <input 
                required
                className="w-full bg-accent/5 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent text-black"
                value={formData.author}
                onChange={e => setFormData({...formData, author: e.target.value})}
                placeholder="e.g. Dr. Saroj Kanti Singha Hazari"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-black ml-1">Subject/Category *</label>
              <input 
                required
                className="w-full bg-accent/5 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent text-black"
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                placeholder="e.g. Science, Fiction, Engineering"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-black ml-1">Condition *</label>
              <select 
                className="w-full bg-accent/5 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent text-black"
                value={formData.condition}
                onChange={e => setFormData({...formData, condition: e.target.value as any})}
              >
                {BOOK_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-black ml-1">Price (BDT) *</label>
              <input 
                required
                type="number"
                className="w-full bg-accent/5 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent text-black"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                placeholder="250"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-black ml-1">Contact Phone *</label>
              <input 
                required
                className="w-full bg-accent/5 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent text-black"
                value={formData.contactPhone}
                onChange={e => setFormData({...formData, contactPhone: e.target.value})}
                placeholder="01XXXXXXXXX"
              />
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-accent/10">
            <h3 className="font-bold text-black">Where is the book located?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select 
                required
                className="bg-accent/5 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent text-black"
                value={location.divisionId}
                onChange={e => setLocation({divisionId: e.target.value, districtId: '', upazilaId: ''})}
              >
                <option value="">Select Division</option>
                {DIVISIONS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <select 
                required
                disabled={!location.divisionId}
                className="bg-accent/5 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent disabled:opacity-50 text-black"
                value={location.districtId}
                onChange={e => setLocation({...location, districtId: e.target.value, upazilaId: ''})}
              >
                <option value="">Select District</option>
                {filteredDistricts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <select 
                required
                disabled={!location.districtId}
                className="bg-accent/5 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent disabled:opacity-50 text-black"
                value={location.upazilaId}
                onChange={e => setLocation({...location, upazilaId: e.target.value})}
              >
                <option value="">Select Upazila</option>
                {filteredUpazilas.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-black ml-1">Description *</label>
              <button 
                type="button"
                onClick={enhanceWithAI}
                disabled={enhancing}
                className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent font-bold hover:bg-accent hover:text-white transition-colors disabled:opacity-50"
              >
                {enhancing ? 'Enhancing...' : '✨ Enhance with AI'}
              </button>
            </div>
            <textarea 
              required
              rows={4}
              className="w-full bg-accent/5 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent text-black"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Tell buyers about the quality, pages, and any highlights..."
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
          >
            {loading ? 'Publishing...' : 'Publish Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellBook;
