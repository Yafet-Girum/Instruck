import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getBusinessShipments } from '../../services/apiService';
import { Shipment, ShipmentStatus } from '../../types/shipment';
import { Truck, Filter, Search, Calendar, ArrowRight } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';

const ShipmentHistory: React.FC = () => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState('all'); // all, week, month, year
  
  useEffect(() => {
    const fetchShipments = async () => {
      if (user) {
        try {
          setLoading(true);
          const data = await getBusinessShipments(user.id);
          setShipments(data);
          setFilteredShipments(data);
        } catch (error) {
          console.error('Error fetching shipments:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchShipments();
  }, [user]);
  
  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, dateFilter, shipments]);
  
  const applyFilters = () => {
    let filtered = [...shipments];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        shipment => 
          shipment.pickupLocation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shipment.deliveryLocation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shipment.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(shipment => shipment.status === statusFilter);
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      
      if (dateFilter === 'week') {
        cutoffDate.setDate(now.getDate() - 7);
      } else if (dateFilter === 'month') {
        cutoffDate.setMonth(now.getMonth() - 1);
      } else if (dateFilter === 'year') {
        cutoffDate.setFullYear(now.getFullYear() - 1);
      }
      
      filtered = filtered.filter(
        shipment => new Date(shipment.createdAt) >= cutoffDate
      );
    }
    
    setFilteredShipments(filtered);
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('all');
  };
  
  return (
    <div className="animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Shipment History</h1>
          <p className="text-neutral-600">View and manage all your shipments</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/business/shipments/create" className="btn-primary">
            <Truck className="mr-2 h-5 w-5" />
            Book New Shipment
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ShipmentStatus | 'all')}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="quoted">Quoted</option>
              <option value="confirmed">Confirmed</option>
              <option value="assigned">Assigned</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <select
              className="select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
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
      <div className="card">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
            <p className="mt-4 text-neutral-600">Loading shipments...</p>
          </div>
        ) : filteredShipments.length === 0 ? (
          <div className="text-center py-12">
            <Truck className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-lg font-medium text-neutral-900">No shipments found</h3>
            <p className="mt-2 text-neutral-600">
              {shipments.length === 0 
                ? "You haven't created any shipments yet." 
                : "No shipments match your current filters."}
            </p>
            {shipments.length === 0 && (
              <Link to="/business/shipments/create" className="btn-primary mt-4">
                Book Your First Shipment
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Cargo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      {shipment.id.substring(0, 9)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                      {shipment.pickupLocation.name} → {shipment.deliveryLocation.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                      {new Date(shipment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                      {shipment.loadType} ({shipment.weight} kg)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={shipment.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      {shipment.price ? `${shipment.price.toLocaleString()} RWF` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/business/shipments/${shipment.id}`} 
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipmentHistory;