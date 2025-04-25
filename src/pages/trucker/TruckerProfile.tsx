import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  Truck, 
  MapPin, 
  Phone, 
  Mail, 
  Shield, 
  Star, 
  Edit, 
  Save,
  FileText,
  Clock,
  CheckCircle
} from 'lucide-react';

const TruckerProfile: React.FC = () => {
  const { user } = useAuth();
  
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '+250 789 123 456',
    address: 'KN 5 Ave, Kigali, Rwanda',
    truckDetails: 'Mitsubishi Canter (4 Ton)',
    licenseNumber: 'RW-TR-123456',
    tinNumber: '123456789',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSave = () => {
    // In a real app, this would send the updated profile to the server
    setEditing(false);
  };
  
  return (
    <div className="animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">My Profile</h1>
          <p className="text-neutral-600">View and edit your profile information</p>
        </div>
        <div className="mt-4 md:mt-0">
          {editing ? (
            <button 
              onClick={handleSave}
              className="btn-primary"
            >
              <Save className="mr-2 h-5 w-5" />
              Save Changes
            </button>
          ) : (
            <button 
              onClick={() => setEditing(true)}
              className="btn-outline"
            >
              <Edit className="mr-2 h-5 w-5" />
              Edit Profile
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="col-span-1">
          <div className="card">
            <div className="flex flex-col items-center">
              <img 
                src={user?.avatar || "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} 
                alt="Profile" 
                className="h-32 w-32 rounded-full object-cover mb-4 border-4 border-white shadow-md"
              />
              
              <h2 className="text-xl font-bold text-neutral-900">{user?.name}</h2>
              <p className="text-neutral-600 mb-4">Verified Trucker</p>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center text-amber-500">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 text-neutral-300" />
                </div>
                <span className="ml-2 text-neutral-700 font-medium">4.8/5</span>
              </div>
              
              <div className="w-full border-t border-neutral-200 my-4 pt-4">
                <div className="flex items-center mb-3">
                  <MapPin className="h-5 w-5 text-neutral-500 mr-2" />
                  <span className="text-neutral-700">
                    {editing ? (
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="input py-1 px-2"
                      />
                    ) : (
                      formData.address
                    )}
                  </span>
                </div>
                
                <div className="flex items-center mb-3">
                  <Phone className="h-5 w-5 text-neutral-500 mr-2" />
                  <span className="text-neutral-700">
                    {editing ? (
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="input py-1 px-2"
                      />
                    ) : (
                      formData.phoneNumber
                    )}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-neutral-500 mr-2" />
                  <span className="text-neutral-700">{user?.email}</span>
                </div>
              </div>
              
              <div className="bg-green-50 text-green-800 rounded-lg p-3 w-full flex items-center">
                <Shield className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm">Verified and approved by Instruck</span>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold mb-4">Performance Stats</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-neutral-600">On-Time Delivery</span>
                  <span className="text-sm text-neutral-900 font-medium">95%</span>
                </div>
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-neutral-600">Customer Rating</span>
                  <span className="text-sm text-neutral-900 font-medium">4.8/5</span>
                </div>
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-neutral-600">Job Acceptance</span>
                  <span className="text-sm text-neutral-900 font-medium">88%</span>
                </div>
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-neutral-600">Delivery Completion</span>
                  <span className="text-sm text-neutral-900 font-medium">100%</span>
                </div>
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Truck & License Details */}
          <div className="card mb-6">
            <h3 className="text-lg font-semibold mb-4">Vehicle & License Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Truck Details</p>
                  {editing ? (
                    <input
                      type="text"
                      name="truckDetails"
                      value={formData.truckDetails}
                      onChange={handleInputChange}
                      className="input"
                    />
                  ) : (
                    <p className="font-medium text-neutral-900">{formData.truckDetails}</p>
                  )}
                </div>
                
                <div>
                  <p className="text-sm text-neutral-500 mb-1">License Number</p>
                  {editing ? (
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className="input"
                    />
                  ) : (
                    <p className="font-medium text-neutral-900">{formData.licenseNumber}</p>
                  )}
                </div>
                
                <div>
                  <p className="text-sm text-neutral-500 mb-1">TIN Number</p>
                  {editing ? (
                    <input
                      type="text"
                      name="tinNumber"
                      value={formData.tinNumber}
                      onChange={handleInputChange}
                      className="input"
                    />
                  ) : (
                    <p className="font-medium text-neutral-900">{formData.tinNumber}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Verification Status</p>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <p className="font-medium text-green-700">Verified</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Registration Date</p>
                  <p className="font-medium text-neutral-900">January 15, 2025</p>
                </div>
                
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Insurance Status</p>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <p className="font-medium text-green-700">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Reviews */}
          <div className="card mb-6">
            <h3 className="text-lg font-semibold mb-4">Recent Reviews</h3>
            
            <div className="space-y-4 divide-y divide-neutral-200">
              <div className="pt-4 first:pt-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <img 
                      src="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                      alt="Reviewer" 
                      className="h-10 w-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <p className="font-medium text-neutral-900">ABC Distributors</p>
                      <p className="text-sm text-neutral-500">Feb 15, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                </div>
                <p className="text-neutral-700">
                  Very professional and on-time. The shipment was delivered in perfect condition. Will definitely use this trucker again for our deliveries.
                </p>
              </div>
              
              <div className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <img 
                      src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                      alt="Reviewer" 
                      className="h-10 w-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <p className="font-medium text-neutral-900">Rwanda Electronics</p>
                      <p className="text-sm text-neutral-500">Feb 10, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 text-neutral-300" />
                  </div>
                </div>
                <p className="text-neutral-700">
                  Good service overall. Handled our electronic goods with care. Just a slight delay in arrival, but kept us informed throughout.
                </p>
              </div>
              
              <div className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <img 
                      src="https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                      alt="Reviewer" 
                      className="h-10 w-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <p className="font-medium text-neutral-900">Kigali Fresh Produce</p>
                      <p className="text-sm text-neutral-500">Feb 5, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                </div>
                <p className="text-neutral-700">
                  Excellent service! The driver was very careful with our perishable goods and ensured they arrived fresh. Communication was great throughout the journey.
                </p>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-green-100 text-green-700 mr-3">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Delivery Completed</p>
                  <p className="text-sm text-neutral-600">You completed delivery #ship-001 from Kigali to Butare</p>
                  <p className="text-xs text-neutral-500 mt-1">2 days ago</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-primary-100 text-primary-700 mr-3">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Job Accepted</p>
                  <p className="text-sm text-neutral-600">You accepted a new delivery job #ship-002 from Kigali to Gisenyi</p>
                  <p className="text-xs text-neutral-500 mt-1">3 days ago</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-blue-100 text-blue-700 mr-3">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Payment Received</p>
                  <p className="text-sm text-neutral-600">You received payment of 85,000 RWF for delivery #ship-006</p>
                  <p className="text-xs text-neutral-500 mt-1">5 days ago</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-amber-100 text-amber-700 mr-3">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">New Review</p>
                  <p className="text-sm text-neutral-600">You received a 5-star review from ABC Distributors</p>
                  <p className="text-xs text-neutral-500 mt-1">1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TruckerProfile;