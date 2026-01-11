
import React from 'react';
import { Link } from 'react-router-dom';
import { BookListing } from '../types';
import { DIVISIONS, DISTRICTS } from '../constants';

interface BookCardProps {
  book: BookListing;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const division = DIVISIONS.find(d => d.id === book.location.divisionId)?.name;
  const district = DISTRICTS.find(d => d.id === book.location.districtId)?.name;

  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `tel:${book.contactPhone}`;
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-accent/5 flex flex-col h-full">
      <Link to={`/books/${book.id}`} className="block relative aspect-[4/5] bg-accent/5 overflow-hidden">
        <img 
          src={`https://picsum.photos/seed/${book.id}/400/500`} 
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-accent shadow-sm border border-accent/10">
          {book.condition}
        </div>
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/books/${book.id}`} className="mb-2">
          <p className="text-xs text-accent font-bold uppercase tracking-wider mb-1">{book.subject}</p>
          <h3 className="text-lg font-bold text-black line-clamp-1 leading-tight group-hover:text-accent transition-colors">{book.title}</h3>
          <p className="text-sm text-black/60 italic">by {book.author}</p>
        </Link>

        <div className="mt-auto pt-4 flex items-end justify-between border-t border-accent/5">
          <div className="flex flex-col">
            <p className="text-2xl font-bold text-black">৳{book.price}</p>
            <div className="flex items-center gap-1 text-black/40 mt-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className="text-xs truncate max-w-[100px]">{district}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
             <button 
              onClick={handleCall}
              title={`Call ${book.sellerName}`}
              className="bg-accent text-white p-3 rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg shadow-accent/20"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.746 4.477a1 1 0 01-.769 1.134l-2.62.524a15.035 15.035 0 006.831 6.831l.524-2.62a1 1 0 011.134-.769l4.477.746a1 1 0 01.836.986V21a1 1 0 01-1 1h-2.22c-9.11 0-16.5-7.39-16.5-16.5V3z"/>
              </svg>
            </button>
            <Link 
              to={`/books/${book.id}`}
              className="bg-accent/10 text-accent p-3 rounded-xl hover:bg-accent hover:text-white transition-all shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
