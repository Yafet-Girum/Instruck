import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Clipboard, FileText, CreditCard, ArrowRight, CheckCircle } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-900 to-primary-700 text-white">
          <div className="container mx-auto px-4 py-20 md:py-28">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-up">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Rwanda's Digital Truck-Hailing Platform for Businesses
                </h1>
                <p className="text-lg mb-8 text-primary-100">
                  Connect with trusted truckers, get transparent pricing, and manage shipments with ease. 
                  Designed for FMCG and agricultural businesses across Rwanda.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/register" className="btn bg-accent-600 hover:bg-accent-700 text-white px-6 py-3 rounded-lg font-semibold">
                    Get Started
                  </Link>
                  <Link to="/about" className="btn bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold">
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <img 
                  src="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Truck on Rwanda road" 
                  className="rounded-lg shadow-xl max-w-full"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Simplifying logistics for businesses across Rwanda with our easy-to-use platform.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-neutral-50 rounded-xl text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clipboard className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">1. Post Your Shipment</h3>
                <p className="text-neutral-600">
                  Enter pickup and delivery locations, load details, and preferred date. Get an instant price quote.
                </p>
              </div>
              
              <div className="p-6 bg-neutral-50 rounded-xl text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">2. Confirm & Track</h3>
                <p className="text-neutral-600">
                  Accept the quote, get matched with a verified trucker, and track your shipment in real-time.
                </p>
              </div>
              
              <div className="p-6 bg-neutral-50 rounded-xl text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">3. Receive RRA Receipts</h3>
                <p className="text-neutral-600">
                  Get tax-compliant digital receipts and consolidated monthly invoices for all your shipments.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features */}
        <section className="py-16 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Instruck</h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Our platform is built specifically for Rwandan businesses and truckers, addressing local logistics challenges.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <img 
                  src="https://images.pexels.com/photos/7469503/pexels-photo-7469503.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Rwanda business logistics" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 text-primary-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Transparent Pricing</h3>
                    <p className="text-neutral-600">
                      No hidden fees or negotiations. Get clear, upfront prices based on distance, load type, and truck size.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 text-primary-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Tax Compliance</h3>
                    <p className="text-neutral-600">
                      All receipts are RRA-compliant with proper documentation for business expense tracking and tax purposes.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 text-primary-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Monthly Billing</h3>
                    <p className="text-neutral-600">
                      Businesses enjoy the convenience of monthly invoicing with detailed shipment records.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 text-primary-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Verified Truckers</h3>
                    <p className="text-neutral-600">
                      All truckers on our platform are verified, insured, and rated for quality service and reliability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-accent-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Simplify Your Logistics?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join hundreds of Rwandan businesses already using Instruck to manage their transportation needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register?type=business" className="btn bg-white text-accent-700 hover:bg-neutral-100 px-6 py-3 rounded-lg font-semibold">
                Sign Up as Business
              </Link>
              <Link to="/register?type=trucker" className="btn bg-accent-700 hover:bg-accent-800 text-white px-6 py-3 rounded-lg font-semibold">
                Sign Up as Trucker
              </Link>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Hear from businesses and truckers who use Instruck across Rwanda.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-neutral-50 rounded-xl">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Testimonial"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold">Marie Uwimana</h4>
                    <p className="text-sm text-neutral-500">Kigali Fresh Produce</p>
                  </div>
                </div>
                <p className="text-neutral-600">
                  "Instruck has transformed how we transport our fresh produce. The transparent pricing and quick trucker matching have reduced our logistics costs by 20%."
                </p>
              </div>
              
              <div className="p-6 bg-neutral-50 rounded-xl">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Testimonial"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold">Jean Mutabazi</h4>
                    <p className="text-sm text-neutral-500">Independent Trucker</p>
                  </div>
                </div>
                <p className="text-neutral-600">
                  "As a trucker, I've increased my monthly jobs by 30%. The platform makes it easy to find shipments along my routes and receive prompt payments."
                </p>
              </div>
              
              <div className="p-6 bg-neutral-50 rounded-xl">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Testimonial"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold">Claude Ndayisaba</h4>
                    <p className="text-sm text-neutral-500">Rwanda Electronics</p>
                  </div>
                </div>
                <p className="text-neutral-600">
                  "The monthly invoicing and RRA-compliant receipts have simplified our accounting process. I can now focus on growing my business instead of logistics paperwork."
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;