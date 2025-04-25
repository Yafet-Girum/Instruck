import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAvailableShipments } from '../../services/apiService';
import { Shipment, LoadType, TruckType } from '../../types/shipment';
import { 
  Truck, 
  Filter, 
  Search, 
  Calendar, 
  MapPin,
  Package,
  ArrowRight,
  Clock
} from 'lucide-react';

const AvailableJobs: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Shipment[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [loadTypeFilter, setLoadTypeFilter] = useState<LoadType | 'all'>('all');
  const [truckTypeFilter, setTruckTypeFilter] = useState<TruckType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date');
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await getAvailableShipments();
        setJobs(data);
        setFilteredJobs(data);
      } catch (error) {
        console.error('Error fetching available jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);
  
  useEffect(() => {
    applyFilters();
  }, [searchTerm, loadTypeFilter, truckTypeFilter, sortBy, jobs]);
  
  const applyFilters = () => {
    let filtered = [...jobs];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        job => 
          job.pickupLocation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.deliveryLocation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply load type filter
    if (loadTypeFilter !== 'all') {
      filtered = filtered.filter(job => job.loadType === loadTypeFilter);
    }
    
    // Apply truck type filter
    if (truckTypeFilter !== 'all') {
      filtered = filtered.filter(job => job.truckType === truckTypeFilter);
    }
    
    // Apply sorting
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(a.pickupDate).getTime() - new Date(b.pickupDate).getTime());
    } else if (sortBy === 'price') {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    
    setFilteredJobs(filtered);
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setLoadTypeFilter('all');
    setTruckTypeFilter('all');
    setSortBy('date');
  };
  
  return (
    <div className="animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Available Jobs</h1>
          <p className="text-neutral-600">Browse and accept shipment jobs in your area</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/trucker" className="btn-outline">
            <Truck className="mr-2 h-5 w-5" />
            Back to Dashboard
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-full md:w-auto flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                className="input pl-10"
                placeholder="Search by location or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-auto">
            <select
              className="select"
              value={loadTypeFilter}
              onChange={(e) => setLoadTypeFilter(e.target.value as LoadType | 'all')}
            >
              <option value="all">All Load Types</option>
              <option value="agricultural">Agricultural</option>
              <option value="construction">Construction</option>
              <option value="retail">Retail</option>
              <option value="furniture">Furniture</option>
              <option value="electronics">Electronics</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <select
              className="select"
              value={truckTypeFilter}
              onChange={(e) => setTruckTypeFilter(e.target.value as TruckType | 'all')}
            >
              <option value="all">All Truck Types</option>
              <option value="small">Small (1-3 tons)</option>
              <option value="medium">Medium (3-7 tons)</option>
              <option value="large">Large (7-15 tons)</option>
              <option value="refrigerated">Refrigerated</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <select
              className="select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'price')}
            >
              <option value="date">Sort by Date</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
          
          <button
            onClick={resetFilters}
            className="btn-outline w-full md:w-auto"
          >
            Reset Filters
          </button>
        </div>
      </div>
      
      {/* Results */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 card">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
            <p className="mt-4 text-neutral-600">Loading available jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12 card">
            <Truck className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-lg font-medium text-neutral-900">No jobs found</h3>
            <p className="mt-2 text-neutral-600">
              {jobs.length === 0 
                ? "There are no available jobs at the moment." 
                : "No jobs match your current filters."}
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div 
              key={job.id} 
              className="card hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {job.pickupLocation.name} to {job.deliveryLocation.name}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Job ID: {job.id.substring(0, 8)} • Posted on {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-2 md:mt-0 text-xl font-bold text-primary-700">
                  {job.price?.toLocaleString()} RWF
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Pickup & Delivery */}
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-2">
                        <MapPin className="h-3 w-3" />
                      </div>
                      <p className="text-sm font-medium text-neutral-900">Pickup Location</p>
                    </div>
                    <p className="text-sm text-neutral-600 mt-1 ml-8">{job.pickupLocation.address}</p>
                  </div>
                  
                  <div className="ml-3 border-l border-dashed border-neutral-300 pl-2 py-1">
                    <ArrowRight className="h-4 w-4 text-neutral-400" />
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center mr-2">
                        <MapPin className="h-3 w-3" />
                      </div>
                      <p className="text-sm font-medium text-neutral-900">Delivery Location</p>
                    </div>
                    <p className="text-sm text-neutral-600 mt-1 ml-8">{job.deliveryLocation.address}</p>
                  </div>
                </div>
                
                {/* Schedule */}
                <div>
                  <p className="text-sm font-medium text-neutral-900 mb-3">Schedule</p>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Calendar className="h-4 w-4 text-neutral-500 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Pickup Date</p>
                        <p className="text-sm text-neutral-600">
                          {new Date(job.pickupDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-4 w-4 text-neutral-500 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Pickup Time</p>
                        <p className="text-sm text-neutral-600">
                          {new Date(job.pickupDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Cargo Details */}
                <div>
                  <p className="text-sm font-medium text-neutral-900 mb-3">Cargo Details</p>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Package className="h-4 w-4 text-neutral-500 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Load Type</p>
                        <p className="text-sm text-neutral-600 capitalize">
                          {job.loadType.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Truck className="h-4 w-4 text-neutral-500 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Truck Type</p>
                        <p className="text-sm text-neutral-600 capitalize">
                          {job.truckType.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="text-neutral-500 mt-0.5 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 100-18 9 9 0 000 18z"/><path d="M12 7v8"/><path d="M8 11l4 4 4-4"/></svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Weight</p>
                        <p className="text-sm text-neutral-600">
                          {job.weight.toLocaleString()} kg
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {job.description && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-neutral-900 mb-1">Description</p>
                  <p className="text-sm text-neutral-600">{job.description}</p>
                </div>
              )}
              
              {job.specialInstructions && (
                <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm font-medium text-amber-800 mb-1">Special Instructions</p>
                  <p className="text-sm text-amber-700">{job.specialInstructions}</p>
                </div>
              )}
              
              <div className="flex justify-end">
                <Link 
                  to={`/trucker/jobs/${job.id}`}
                  className="btn-primary"
                >
                  View Job Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AvailableJobs;