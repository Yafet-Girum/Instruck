import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-800 text-neutral-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Truck className="h-8 w-8 text-primary-400" strokeWidth={2} />
              <span className="ml-2 text-xl font-bold text-white">Instruck</span>
            </div>
            <p className="mb-4 text-sm">
              Connecting Rwandan businesses with reliable trucking services. 
              Simplifying logistics for a more efficient supply chain.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-neutral-400 hover:text-white text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-neutral-400 hover:text-white text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-neutral-400 hover:text-white text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-neutral-400 hover:text-white text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-neutral-400 hover:text-white text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* For Businesses */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Businesses</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/register" className="text-neutral-400 hover:text-white text-sm">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/business/shipments/create" className="text-neutral-400 hover:text-white text-sm">
                  Book a Truck
                </Link>
              </li>
              <li>
                <Link to="/business/invoices" className="text-neutral-400 hover:text-white text-sm">
                  Monthly Invoicing
                </Link>
              </li>
              <li>
                <Link to="/business/tracking" className="text-neutral-400 hover:text-white text-sm">
                  Shipment Tracking
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-neutral-400 hover:text-white text-sm">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Mail size={16} className="text-neutral-400" />
                </div>
                <span className="ml-2 text-neutral-400 text-sm">info@instruck.com</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Phone size={16} className="text-neutral-400" />
                </div>
                <span className="ml-2 text-neutral-400 text-sm">+250 788 123 456</span>
              </li>
              <li className="text-neutral-400 text-sm">
                KN 5 Avenue, Kigali Heights<br />
                Kigali, Rwanda
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t border-neutral-700 text-sm text-neutral-500">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 Instruck. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="/terms" className="hover:text-neutral-300">
                Terms of Service
              </Link>
              <Link to="/privacy" className="hover:text-neutral-300">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="hover:text-neutral-300">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;