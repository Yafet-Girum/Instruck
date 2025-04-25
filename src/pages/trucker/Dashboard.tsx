import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getTruckerShipments } from '../../services/apiService';
import { Shipment } from '../../types/shipment';
import { 
  Truck, 
  TrendingUp, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle, 
  ChevronRight 
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';

const TruckerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          setLoading(true);
          const data = await getTruckerShipments(user.id);
          setShipments(data);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user]);

  // Calculate metrics
  const activeShipments = shipments.filter(s => 
    ['assigned', 'in_transit'].includes(s.status)
  ).length;
  
  const completedShipments = shipments.filter(s => s.status === 'delivered').length;
  
  const totalEarned = shipments
    .filter(s => s.status === 'delivered')
    .reduce((sum, s) => sum + (s.price || 0), 0);
  
  // Get active and recent shipments
  const activeJobs = shipments.filter(s => 
    ['assigned', 'in_transit'].includes(s.status)
  );
  
  const completedJobs = shipments
    .filter(s => s.status === 'delivered')
    .slice(0, 3);

  return (
    <div className="animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Welcome, {user?.name}</h1>
          <p className="text-neutral-600">Manage your deliveries and track your earnings</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/trucker/jobs" className="btn-primary">
            <Truck className="mr-2 h-5 w-5" />
            Browse Available Jobs
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="card flex items-start">
          <div className="p-3 rounded-lg bg-blue-100 text-blue-700 mr-4">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-neutral-600 text-sm">Active Jobs</span>
            <h3 className="text-2xl font-bold text-neutral-900">{activeShipments}</h3>
          </div>
        </div>

        <div className="card flex items-start">
          <div className="p-3 rounded-lg bg-green-100 text-green-700 mr-4">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-neutral-600 text-sm">Completed Deliveries</span>
            <h3 className="text-2xl font-bold text-neutral-900">{completedShipments}</h3>
          </div>
        </div>

        <div className="card flex items-start">
          <div className="p-3 rounded-lg bg-purple-100 text-purple-700 mr-4">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-neutral-600 text-sm">Total Earned</span>
            <h3 className="text-2xl font-bold text-neutral-900">{totalEarned.toLocaleString()} RWF</h3>
          </div>
        </div>
      </div>

      {/* Earnings Chart */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Earnings Overview</h2>
          <div className="text-sm font-medium text-primary-600">Last 30 days</div>
        </div>
        
        <div className="h-64 w-full">
          {/* Simplified chart with bars for last 7 days */}
          <div className="h-full flex items-end space-x-1">
            {Array.from({ length: 30 }).map((_, i) => {
              // Generate random heights for the bars
              const height = Math.floor(Math.random() * 80) + 20;
              return (
                <div 
                  key={i} 
                  className="flex-1 bg-primary-500 hover:bg-primary-600 transition-all rounded-t-sm"
                  style={{ height: `${height}%` }}
                  title={`Day ${i + 1}: ${Math.floor(height * 1000)} RWF`}
                ></div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-neutral-500">
            <span>Feb 1</span>
            <span>Feb 15</span>
            <span>Feb 28</span>
          </div>
        </div>
      </div>

      {/* Active Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Active Jobs</h2>
              <Link to="/trucker/jobs" className="text-sm font-medium text-primary-600 flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            {loading ? (
              <div className="text-center py-6 text-neutral-500">Loading jobs...</div>
            ) : activeJobs.length === 0 ? (
              <div className="text-center py-6 text-neutral-500">
                <p className="mb-4">No active jobs</p>
                <Link to="/trucker/jobs" className="btn-outline">
                  Browse Available Jobs
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activeJobs.map((job) => (
                  <div key={job.id} className="border border-neutral-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link 
                          to={`/trucker/jobs/${job.id}`} 
                          className="font-medium text-neutral-900 hover:text-primary-600"
                        >
                          {job.pickupLocation.name} to {job.deliveryLocation.name}
                        </Link>
                        <p className="text-sm text-neutral-600">{job.loadType} • {job.weight} kg</p>
                      </div>
                      <StatusBadge status={job.status} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-neutral-400 mr-2" />
                        <span className="text-sm text-neutral-600">
                          {new Date(job.pickupDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-neutral-400 mr-2" />
                        <span className="text-sm text-neutral-600">
                          {new Date(job.pickupDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-neutral-400 mr-2" />
                        <span className="text-sm text-neutral-600">
                          {job.pickupLocation.address}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 text-neutral-400 mr-2" />
                        <span className="text-sm text-neutral-600">
                          {job.truckType}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-200">
                      <div className="text-sm font-medium">
                        {job.price ? `${job.price.toLocaleString()} RWF` : '-'}
                      </div>
                      <Link 
                        to={`/trucker/jobs/${job.id}`}
                        className="btn-primary py-1 px-3 text-sm"
                      >
                        {job.status === 'assigned' ? 'Start Trip' : 'View Details'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Completed Jobs */}
        <div>
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Completed Jobs</h2>
              <Link to="/trucker/earnings" className="text-sm font-medium text-primary-600 flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            {loading ? (
              <div className="text-center py-6 text-neutral-500">Loading jobs...</div>
            ) : completedJobs.length === 0 ? (
              <div className="text-center py-6 text-neutral-500">
                <p>No completed jobs</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-200">
                {completedJobs.map((job) => (
                  <div key={job.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <Link 
                        to={`/trucker/jobs/${job.id}`}
                        className="font-medium text-neutral-900 hover:text-primary-600"
                      >
                        {job.pickupLocation.name} to {job.deliveryLocation.name}
                      </Link>
                      <StatusBadge status={job.status} />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-neutral-500">
                        {job.deliveryDate ? new Date(job.deliveryDate).toLocaleDateString() : '-'}
                      </div>
                      <div className="text-sm font-medium">
                        {job.price ? `${job.price.toLocaleString()} RWF` : '-'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Performance Stats */}
          <div className="card mt-6">
            <h2 className="text-xl font-semibold mb-4">Performance Stats</h2>
            
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TruckerDashboard;