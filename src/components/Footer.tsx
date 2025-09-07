import { Link } from 'react-router-dom';
import { Facebook, MessageCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-maritime-deep text-white">
      {/* Main Footer Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Branding Section */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">SS</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Shah Ship</h3>
                  <p className="text-white/80 text-sm">Fastest & Safest Shipment</p>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Fastest & Safest Shipment With Us
              </h2>
              <p className="text-white/80 text-lg leading-relaxed max-w-lg">
                Your trusted partner for shipping from China to Bangladesh. We ensure your cargo 
                reaches its destination safely and on time, every time.
              </p>
              
              {/* Ship Illustration */}
              <div className="mt-8 hidden lg:block">
                <div className="w-64 h-32 bg-gradient-to-r from-accent/20 to-primary/20 rounded-2xl flex items-center justify-center mx-auto lg:mx-0">
                  <div className="text-6xl">🚢</div>
                </div>
              </div>
            </div>

            {/* Our Brands Section */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-8">Our Brands</h3>
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all">
                  <div className="w-16 h-16 bg-gradient-hero rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">SS</span>
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Shah Ship</h4>
                  <p className="text-white/80">China to Bangladesh shipping & logistics services</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all">
                  <div className="w-16 h-16 bg-gradient-hero rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">ST</span>
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Shah Tech</h4>
                  <p className="text-white/80">Technology solutions & services</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/20 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Links */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              <Link to="/about" className="text-white/80 hover:text-white transition-colors">
                About Us
              </Link>
              <Link to="/privacy" className="text-white/80 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/returns" className="text-white/80 hover:text-white transition-colors">
                Returns & Refund
              </Link>
              <Link to="/terms" className="text-white/80 hover:text-white transition-colors">
                Terms & Conditions
              </Link>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/8801756005575"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all hover:scale-110"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="text-center mt-4 pt-4 border-t border-white/10">
            <p className="text-white/60 text-sm mb-2">
              © 2024 Shah Ship. All rights reserved. | Built with care for safe shipping.
            </p>
            <p className="text-white/50 text-xs">
              Trade License No.: TRAD/DNCC/006033/2023
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};