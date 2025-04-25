import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createShipment } from '../../services/apiService';
import { LoadType, TruckType, Location } from '../../types/shipment';
import { Truck, ArrowRight, Package, MapPin, Calendar, Info, CheckCircle } from 'lucide-react';

const CreateShipment: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [quoteReady, setQuoteReady] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  
  // Form data
  const [formData, setFormData] = useState({
    loadType: '' as LoadType,
    truckType: '' as TruckType,
    weight: 0,
    volume: 0,
    pickupLocation: {
      name: '',
      address: '',
    },
    deliveryLocation: {
      name: '',
      address: '',
    },
    pickupDate: '',
    description: '',
    specialInstructions: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties (locations)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof typeof formData] as object,
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const goToNextStep = () => {
    if (step === 2) {
      // Calculate quote after step 2
      calculateQuote();
    }
    setStep(step + 1);
  };

  const goToPreviousStep = () => {
    setStep(step - 1);
  };

  const calculateQuote = () => {
    setLoading(true);
    
    // Simulate API call for price calculation
    setTimeout(() => {
      // Generate a random price between 50,000 and 200,000 RWF
      const price = Math.round((Math.random() * 150000 + 50000) / 1000) * 1000;
      setEstimatedPrice(price);
      setQuoteReady(true);
      setLoading(false);
    }, 1500);
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Create the shipment
      const shipmentData = {
        ...formData,
        businessId: user.id,
        businessName: user.name,
        price: estimatedPrice,
      };
      
      const newShipment = await createShipment(shipmentData);
      
      // Redirect to shipment details page
      navigate(`/business/shipments/${newShipment.id}`);
    } catch (error) {
      console.error('Error creating shipment:', error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-slide-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Book a New Shipment</h1>
        <p className="text-neutral-600">Enter shipment details to get an instant quote</p>
      </div>
      
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            step >= 1 ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-neutral-600'
          }`}>
            <Package className="w-5 h-5" />
          </div>
          <div className={`flex-1 h-1 mx-2 ${
            step >= 2 ? 'bg-primary-600' : 'bg-neutral-200'
          }`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            step >= 2 ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-neutral-600'
          }`}>
            <MapPin className="w-5 h-5" />
          </div>
          <div className={`flex-1 h-1 mx-2 ${
            step >= 3 ? 'bg-primary-600' : 'bg-neutral-200'
          }`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            step >= 3 ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-neutral-600'
          }`}>
            <Info className="w-5 h-5" />
          </div>
          <div className={`flex-1 h-1 mx-2 ${
            step >= 4 ? 'bg-primary-600' : 'bg-neutral-200'
          }`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            step >= 4 ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-neutral-600'
          }`}>
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <div className="text-xs font-medium text-neutral-600">Cargo Details</div>
          <div className="text-xs font-medium text-neutral-600">Locations</div>
          <div className="text-xs font-medium text-neutral-600">Additional Info</div>
          <div className="text-xs font-medium text-neutral-600">Confirmation</div>
        </div>
      </div>
      
      <div className="card">
        {/* Step 1: Cargo Details */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Cargo Details</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="loadType" className="block text-sm font-medium text-neutral-700 mb-1">
                  Load Type*
                </label>
                <select
                  id="loadType"
                  name="loadType"
                  value={formData.loadType}
                  onChange={handleInputChange}
                  className="select"
                  required
                >
                  <option value="">Select load type</option>
                  <option value="agricultural">Agricultural Products</option>
                  <option value="construction">Construction Materials</option>
                  <option value="retail">Retail Goods</option>
                  <option value="furniture">Furniture</option>
                  <option value="electronics">Electronics</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="truckType" className="block text-sm font-medium text-neutral-700 mb-1">
                  Truck Type*
                </label>
                <select
                  id="truckType"
                  name="truckType"
                  value={formData.truckType}
                  onChange={handleInputChange}
                  className="select"
                  required
                >
                  <option value="">Select truck type</option>
                  <option value="small">Small (1-3 tons)</option>
                  <option value="medium">Medium (3-7 tons)</option>
                  <option value="large">Large (7-15 tons)</option>
                  <option value="refrigerated">Refrigerated</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-neutral-700 mb-1">
                  Weight (kg)*
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight || ''}
                  onChange={handleInputChange}
                  className="input"
                  min="0"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="volume" className="block text-sm font-medium text-neutral-700 mb-1">
                  Volume (cubic meters) <span className="text-neutral-500">(optional)</span>
                </label>
                <input
                  type="number"
                  id="volume"
                  name="volume"
                  value={formData.volume || ''}
                  onChange={handleInputChange}
                  className="input"
                  min="0"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: Pickup and Delivery Locations */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Pickup & Delivery Locations</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="pickupLocation.name" className="block text-sm font-medium text-neutral-700 mb-1">
                  Pickup Location (City/District)*
                </label>
                <input
                  type="text"
                  id="pickupLocation.name"
                  name="pickupLocation.name"
                  value={formData.pickupLocation.name}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="pickupLocation.address" className="block text-sm font-medium text-neutral-700 mb-1">
                  Pickup Address*
                </label>
                <input
                  type="text"
                  id="pickupLocation.address"
                  name="pickupLocation.address"
                  value={formData.pickupLocation.address}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="deliveryLocation.name" className="block text-sm font-medium text-neutral-700 mb-1">
                  Delivery Location (City/District)*
                </label>
                <input
                  type="text"
                  id="deliveryLocation.name"
                  name="deliveryLocation.name"
                  value={formData.deliveryLocation.name}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="deliveryLocation.address" className="block text-sm font-medium text-neutral-700 mb-1">
                  Delivery Address*
                </label>
                <input
                  type="text"
                  id="deliveryLocation.address"
                  name="deliveryLocation.address"
                  value={formData.deliveryLocation.address}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Additional Information */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Additional Information</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="pickupDate" className="block text-sm font-medium text-neutral-700 mb-1">
                  Preferred Pickup Date*
                </label>
                <input
                  type="datetime-local"
                  id="pickupDate"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
                  Cargo Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input"
                  rows={3}
                />
              </div>
              
              <div>
                <label htmlFor="specialInstructions" className="block text-sm font-medium text-neutral-700 mb-1">
                  Special Instructions <span className="text-neutral-500">(optional)</span>
                </label>
                <textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  className="input"
                  rows={3}
                  placeholder="e.g., Fragile items, specific handling requirements"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Step 4: Price Quote and Confirmation */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Review & Confirm</h2>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="mb-4">
                  <div className="h-16 w-16 border-4 border-t-primary-600 border-primary-200 rounded-full animate-spin"></div>
                </div>
                <p className="text-neutral-600">Calculating your quote...</p>
              </div>
            ) : quoteReady ? (
              <div>
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-neutral-900">Price Quote</h3>
                    <span className="text-sm text-primary-600">Instant Quote</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-neutral-600">Total Price</span>
                    <span className="text-2xl font-bold text-primary-700">{estimatedPrice.toLocaleString()} RWF</span>
                  </div>
                  <div className="text-sm text-neutral-600">
                    <p>Price includes all taxes and fees. An RRA-compliant receipt will be provided after delivery.</p>
                  </div>
                </div>
                
                <div className="border border-neutral-200 rounded-lg divide-y divide-neutral-200 mb-6">
                  <div className="p-4">
                    <h4 className="font-semibold mb-2">Cargo Details</h4>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      <dt className="text-neutral-500">Load Type:</dt>
                      <dd className="text-neutral-900">{formData.loadType}</dd>
                      <dt className="text-neutral-500">Truck Type:</dt>
                      <dd className="text-neutral-900">{formData.truckType}</dd>
                      <dt className="text-neutral-500">Weight:</dt>
                      <dd className="text-neutral-900">{formData.weight} kg</dd>
                      {formData.volume > 0 && (
                        <>
                          <dt className="text-neutral-500">Volume:</dt>
                          <dd className="text-neutral-900">{formData.volume} m³</dd>
                        </>
                      )}
                    </dl>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-2">Locations</h4>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      <dt className="text-neutral-500">Pickup:</dt>
                      <dd className="text-neutral-900">{formData.pickupLocation.name}</dd>
                      <dt className="text-neutral-500">Pickup Address:</dt>
                      <dd className="text-neutral-900">{formData.pickupLocation.address}</dd>
                      <dt className="text-neutral-500">Delivery:</dt>
                      <dd className="text-neutral-900">{formData.deliveryLocation.name}</dd>
                      <dt className="text-neutral-500">Delivery Address:</dt>
                      <dd className="text-neutral-900">{formData.deliveryLocation.address}</dd>
                    </dl>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-2">Schedule & Notes</h4>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      <dt className="text-neutral-500">Pickup Date:</dt>
                      <dd className="text-neutral-900">{new Date(formData.pickupDate).toLocaleString()}</dd>
                      {formData.description && (
                        <>
                          <dt className="text-neutral-500">Description:</dt>
                          <dd className="text-neutral-900">{formData.description}</dd>
                        </>
                      )}
                      {formData.specialInstructions && (
                        <>
                          <dt className="text-neutral-500">Special Instructions:</dt>
                          <dd className="text-neutral-900">{formData.specialInstructions}</dd>
                        </>
                      )}
                    </dl>
                  </div>
                </div>
                
                <div className="bg-neutral-50 p-4 rounded-lg mb-6 text-sm">
                  <p className="mb-2 font-medium text-neutral-700">What happens next?</p>
                  <ul className="space-y-2 text-neutral-600">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                      <span>Upon confirmation, your shipment will be posted to our trucker network</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                      <span>You'll be notified when a verified trucker is assigned</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                      <span>After delivery, you'll receive a digital RRA-compliant receipt</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                      <span>Payment will be included in your monthly invoice</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-600">
                <p>Please complete previous steps to get a quote</p>
              </div>
            )}
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button 
              type="button" 
              onClick={goToPreviousStep}
              className="btn-outline"
              disabled={loading}
            >
              Back
            </button>
          ) : (
            <div></div> // Empty div for spacing
          )}
          
          {step < 4 ? (
            <button 
              type="button" 
              onClick={goToNextStep}
              className="btn-primary"
            >
              Next Step
            </button>
          ) : (
            <button 
              type="button" 
              onClick={handleSubmit}
              className="btn-primary"
              disabled={loading || !quoteReady}
            >
              Confirm Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateShipment;