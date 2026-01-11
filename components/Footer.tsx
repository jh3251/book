
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-accent/10 mt-auto py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-accent mb-4">BookSwap Bangladesh</h3>
            <p className="text-black/60 font-medium max-w-xs leading-relaxed">
              The leading marketplace for students across Bangladesh to trade knowledge, one book at a time.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-black mb-4">Quick Links</h4>
            <ul className="space-y-2 text-black/60 font-medium">
              <li><a href="#" className="hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contact Support</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Safety Guide</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-black mb-4">Top Locations</h4>
            <ul className="space-y-2 text-black/60 font-medium">
              <li><a href="#" className="hover:text-accent transition-colors">Dhaka</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Chattogram</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Sylhet</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-accent/5 text-center text-black/40 text-sm font-medium">
          &copy; {new Date().getFullYear()} BookSwap Bangladesh. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
