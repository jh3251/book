
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

  return (
    <Link 
      to={`/books/${book.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-accent/5 flex flex-col h-full"
    >
      <div className="relative aspect-[4/5] bg-accent/5 overflow-hidden">
        <img 
          src={`https://picsum.photos/seed/${book.id}/400/500`} 
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-accent shadow-sm border border-accent/10">
          {book.condition}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
          <p className="text-xs text-accent font-bold uppercase tracking-wider mb-1">{book.subject}</p>
          <h3 className="text-lg font-bold text-black line-clamp-1 leading-tight">{book.title}</h3>
          <p className="text-sm text-black/60 italic">by {book.author}</p>
        </div>

        <div className="mt-auto pt-4 flex items-end justify-between">
          <div className="flex flex-col">
            <p className="text-2xl font-bold text-black">৳{book.price}</p>
            <div className="flex items-center gap-1 text-black/40 mt-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs truncate max-w-[100px]">{district}, {division}</span>
            </div>
          </div>
          
          <span className="bg-accent/10 text-accent p-2 rounded-xl group-hover:bg-accent group-hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
