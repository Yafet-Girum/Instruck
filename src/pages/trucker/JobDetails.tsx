import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getShipmentById, assignTruckerToShipment, updateShipmentStatus } from '../../services/apiService';
import { Shipment } from '../../types/shipment';
import { 
  Truck, 
  Map, 
  Package, 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronLeft,
  CheckCircle,
  ArrowRight,
  Phone,
  Navigation,
  AlertCircle
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [job, setJob] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  
  useEffect(() => {
    const fetchJob = async () => {
      if (id) {
        try {
          setLoading(true);
          const data = await getShipmentById(id);
          if (data) {
            setJob(data);
          }
        } catch (error) {
          console.error('Error fetching job details:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchJob();
  }, [id]);
  
  const handleAcceptJob = async () => {
    if (!job || !user || !id) return;
    
    try {
      setProcessing(true);
      
      const updated = await assignTruckerToShipment(id, user.id, user.name);
      
      if (updated) {
        setJob(updated);
        setShowAcceptModal(false);
      }
    } catch (error) {
      console.error('Error accepting job:', error);
    } finally {
      setProcessing(false);
    }
  };
  
  const handleStartTrip = async () => {
    if (!job || !id) return;
    
    try {
      setProcessing(true);
      
      const updated = await updateShipmentStatus(id, 'in_transit');
      
      if (updated) {
        setJob(updated);
      }
    } catch (error) {
      console.error('Error starting trip:', error);
    } finally {
      setProcessing(false);
    }
  };
  
  const handleCompleteDelivery = async () => {
    if (!job || !id) return;
    
    try {
      setProcessing(true);
      
      const updated = await updateShipmentStatus(id, 'delivered');
      
      if (updated) {
        setJob({
          ...updated,
          deliveryDate: new Date().toISOString()
        });
        setShowCompleteModal(false);
      }
    } catch (error) {
      console.error('Error completing delivery:', error);
    } finally {
      setProcessing(false);
    }
  };
  
  if (loading && !job) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
        <p className="ml-4 text-neutral-600">Loading job details...</p>
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-neutral-900">Job not found</h3>
        <p className="mt-2 text-neutral-600">The job you're looking for doesn't exist or you don't have access to it.</p>
        <Link to="/trucker/jobs" className="btn-outline mt-4">
          Back to Available Jobs
        </Link>
      </div>
    );
  }
  
  const isJobAssignedToCurrentUser = job.truckerId === user?.id;
  const canAcceptJob = job.status === 'quoted' && !job.truckerId;
  const canStartTrip = job.status === 'assigned' && isJobAssignedToCurrentUser;
  const canCompleteDelivery = job.status === 'in_transit' && isJobAssignedToCurrentUser;
  
  return (
    <div className="animate-slide-up">
      {/* Back Link */}
      <Link 
        to={isJobAssignedToCurrentUser ? "/trucker" : "/trucker/jobs"} 
        className="flex items-center text-neutral-600 hover:text-neutral-900 mb-6"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to {isJobAssignedToCurrentUser ? "Dashboard" : "Available Jobs"}
      </Link>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-neutral-900 mr-4">
              Delivery Job #{job.id.substring(0, 8)}
            </h1>
            <StatusBadge status={job.status} />
          </div>
          <p className="text-neutral-600 mt-1">
            {job.pickupLocation.name} to {job.deliveryLocation.name}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          {canAcceptJob && (
            <button 
              onClick={() => setShowAcceptModal(true)} 
              className="btn-primary"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Accept Job
            </button>
          )}
          
          {canStartTrip && (
            <button 
              onClick={handleStartTrip} 
              className="btn-primary"
              disabled={processing}
            >
              <Truck className="mr-2 h-5 w-5" />
              {processing ? 'Processing...' : 'Start Trip'}
            </button>
          )}
          
          {canCompleteDelivery && (
            <button 
              onClick={() => setShowCompleteModal(true)} 
              className="btn-primary"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Complete Delivery
            </button>
          )}
          
          {isJobAssignedToCurrentUser && job.pickupLocation.coordinates && (
            <a 
              href={`https://maps.google.com/maps?q=${job.pickupLocation.coordinates.lat},${job.pickupLocation.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <Navigation className="mr-2 h-5 w-5" />
              Get Directions
            </a>
          )}
        </div>
      </div>
      
      {/* Price Banner */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-primary-700">Job Payment</p>
            <p className="text-2xl font-bold text-primary-800">{job.price?.toLocaleString()} RWF</p>
          </div>
          <div className="text-sm text-primary-600">
            {job.status === 'delivered' 
              ? 'Payment has been confirmed' 
              : 'Payment on delivery completion'}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Details */}
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-6">Job Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Route */}
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-green-100 text-green-700 mr-3">
                    <Map className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium text-neutral-900">Route</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">Pickup Location</p>
                    <p className="font-medium text-neutral-900">{job.pickupLocation.name}</p>
                    <p className="text-sm text-neutral-600">{job.pickupLocation.address}</p>
                  </div>
                  
                  <div className="relative pl-6">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-neutral-200 ml-1.5"></div>
                    <ArrowDown className="h-4 w-4 text-neutral-400 absolute left-0 top-1/2 transform -translate-y-1/2" />
                  </div>
                  
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">Delivery Location</p>
                    <p className="font-medium text-neutral-900">{job.deliveryLocation.name}</p>
                    <p className="text-sm text-neutral-600">{job.deliveryLocation.address}</p>
                  </div>
                </div>
              </div>
              
              {/* Cargo */}
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700 mr-3">
                    <Package className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium text-neutral-900">Cargo</h3>
                </div>
                
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-neutral-500 mb-1">Load Type</dt>
                    <dd className="font-medium text-neutral-900 capitalize">{job.loadType.replace('_', ' ')}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm text-neutral-500 mb-1">Truck Type</dt>
                    <dd className="font-medium text-neutral-900 capitalize">{job.truckType.replace('_', ' ')}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm text-neutral-500 mb-1">Weight</dt>
                    <dd className="font-medium text-neutral-900">{job.weight.toLocaleString()} kg</dd>
                  </div>
                  
                  {job.volume && (
                    <div>
                      <dt className="text-sm text-neutral-500 mb-1">Volume</dt>
                      <dd className="font-medium text-neutral-900">{job.volume} m³</dd>
                    </div>
                  )}
                  
                  {job.description && (
                    <div>
                      <dt className="text-sm text-neutral-500 mb-1">Description</dt>
                      <dd className="text-neutral-900">{job.description}</dd>
                    </div>
                  )}
                </dl>
              </div>
              
              {/* Schedule */}
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-700 mr-3">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium text-neutral-900">Schedule</h3>
                </div>
                
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-neutral-500 mb-1">Job Created</dt>
                    <dd className="font-medium text-neutral-900">{new Date(job.createdAt).toLocaleString()}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm text-neutral-500 mb-1">Pickup Date & Time</dt>
                    <dd className="font-medium text-neutral-900">{new Date(job.pickupDate).toLocaleString()}</dd>
                  </div>
                  
                  {job.deliveryDate && (
                    <div>
                      <dt className="text-sm text-neutral-500 mb-1">Delivery Date & Time</dt>
                      <dd className="font-medium text-neutral-900">{new Date(job.deliveryDate).toLocaleString()}</dd>
                    </div>
                  )}
                </dl>
              </div>
              
              {/* Special Instructions */}
              {job.specialInstructions && (
                <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-lg bg-amber-100 text-amber-700 mr-3">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <h3 className="font-medium text-neutral-900">Special Instructions</h3>
                  </div>
                  
                  <p className="text-neutral-800">{job.specialInstructions}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Business Info Card */}
          <div className="card mb-6">
            <h3 className="text-lg font-semibold mb-4">Business Information</h3>
            
            <div className="flex items-center mb-4">
              <img 
                src="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Business" 
                className="h-16 w-16 rounded-full object-cover"
              />
              <div className="ml-4">
                <h4 className="font-medium text-neutral-900">{job.businessName}</h4>
                <p className="text-sm text-neutral-600">ID: {job.businessId}</p>
              </div>
            </div>
            
            {(isJobAssignedToCurrentUser || job.status === 'delivered') && (
              <div className="border-t border-neutral-200 pt-4 mt-4">
                <a 
                  href={`tel:+250789123456`} 
                  className="flex items-center justify-center py-2 px-4 border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Business
                </a>
              </div>
            )}
          </div>
          
          {/* Status Timeline */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Delivery Status</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-7 w-7 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div className="ml-3">
                  <h4 className="text-base font-medium text-neutral-900">Job Posted</h4>
                  <p className="text-sm text-neutral-500">{new Date(job.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center ${
                  ['assigned', 'in_transit', 'delivered'].includes(job.status)
                    ? 'bg-green-500 text-white' 
                    : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {['assigned', 'in_transit', 'delivered'].includes(job.status) 
                    ? <CheckCircle className="h-4 w-4" /> 
                    : '2'}
                </div>
                <div className="ml-3">
                  <h4 className="text-base font-medium text-neutral-900">Job Accepted</h4>
                  <p className="text-sm text-neutral-500">
                    {['assigned', 'in_transit', 'delivered'].includes(job.status)
                      ? job.truckerName 
                      : 'Pending'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center ${
                  ['in_transit', 'delivered'].includes(job.status) 
                    ? 'bg-green-500 text-white' 
                    : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {['in_transit', 'delivered'].includes(job.status) 
                    ? <CheckCircle className="h-4 w-4" /> 
                    : '3'}
                </div>
                <div className="ml-3">
                  <h4 className="text-base font-medium text-neutral-900">Trip Started</h4>
                  <p className="text-sm text-neutral-500">
                    {['in_transit', 'delivered'].includes(job.status)
                      ? 'In transit to destination'
                      : 'Pending'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center ${
                  job.status === 'delivered' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {job.status === 'delivered' 
                    ? <CheckCircle className="h-4 w-4" /> 
                    : '4'}
                </div>
                <div className="ml-3">
                  <h4 className="text-base font-medium text-neutral-900">Delivered</h4>
                  <p className="text-sm text-neutral-500">
                    {job.status === 'delivered' && job.deliveryDate
                      ? new Date(job.deliveryDate).toLocaleString()
                      : 'Pending'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center ${
                  job.status === 'delivered' && job.paymentStatus === 'confirmed'
                    ? 'bg-green-500 text-white' 
                    : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {job.status === 'delivered' && job.paymentStatus === 'confirmed'
                    ? <CheckCircle className="h-4 w-4" /> 
                    : '5'}
                </div>
                <div className="ml-3">
                  <h4 className="text-base font-medium text-neutral-900">Payment Confirmed</h4>
                  <p className="text-sm text-neutral-500">
                    {job.status === 'delivered' && job.paymentStatus === 'confirmed'
                      ? `${job.price?.toLocaleString()} RWF`
                      : 'Pending'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Accept Job Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold">Accept This Job</h2>
                <button 
                  onClick={() => setShowAcceptModal(false)}
                  className="text-neutral-500 hover:text-neutral-700"
                  disabled={processing}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-neutral-600">Job Payment</span>
                    <span className="text-xl font-bold text-primary-700">{job.price?.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Route</span>
                    <span className="text-neutral-900 font-medium">{job.pickupLocation.name} to {job.deliveryLocation.name}</span>
                  </div>
                </div>
                
                <p className="text-neutral-600 mb-4">
                  By accepting this job, you agree to:
                </p>
                
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Pick up the shipment at the specified location and time</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Deliver the cargo safely to the destination</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Update the delivery status throughout the trip</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Confirm delivery completion through the app</span>
                  </li>
                </ul>
                
                <div className="mb-4">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm text-neutral-600">
                      I understand and agree to the terms of this delivery job
                    </span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={handleAcceptJob}
                  className="btn-primary w-full py-3"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>Accept Job</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Complete Delivery Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold">Complete Delivery</h2>
                <button 
                  onClick={() => setShowCompleteModal(false)}
                  className="text-neutral-500 hover:text-neutral-700"
                  disabled={processing}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </div>
                
                <p className="text-center text-lg font-medium mb-2">
                  Confirm Delivery Completion
                </p>
                
                <p className="text-center text-neutral-600 mb-6">
                  By confirming, you certify that you have successfully delivered the shipment to:
                </p>
                
                <div className="bg-neutral-50 rounded-lg p-4 mb-6">
                  <p className="font-medium text-neutral-900">{job.deliveryLocation.name}</p>
                  <p className="text-neutral-600">{job.deliveryLocation.address}</p>
                </div>
                
                <div className="mb-4">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm text-neutral-600">
                      I confirm that the shipment has been delivered successfully and received by the recipient
                    </span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={handleCompleteDelivery}
                  className="btn-primary w-full py-3"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>Complete Delivery</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Arrow component for visual indication of direction
const ArrowDown: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 5L12 19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default JobDetails;