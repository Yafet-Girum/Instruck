import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getTruckerShipments } from '../../services/apiService';
import { Shipment } from '../../types/shipment';
import { 
  TrendingUp, 
  Calendar, 
  Filter, 
  Download, 
  ChevronRight,
  Truck
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';

const EarningsPage: React.FC = () => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [periodFilter, setPeriodFilter] = useState<'week' | 'month' | 'year' | 'all'>('month');
  
  // Calculate date ranges
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);
  
  const monthAgo = new Date(today);
  monthAgo.setMonth(today.getMonth() - 1);
  
  const yearAgo = new Date(today);
  yearAgo.setFullYear(today.getFullYear() - 1);
  
  useEffect(() => {
    const fetchShipments = async () => {
      if (user) {
        try {
          setLoading(true);
          const data = await getTruckerShipments(user.id);
          setShipments(data);
        } catch (error) {
          console.error('Error fetching trucker shipments:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchShipments();
  }, [user]);
  
  useEffect(() => {
    applyFilters();
  }, [periodFilter, shipments]);
  
  const applyFilters = () => {
    // Filter completed shipments
    let filtered = shipments.filter(s => s.status === 'delivered');
    
    // Apply period filter
    if (periodFilter !== 'all') {
      let cutoffDate;
      
      if (periodFilter === 'week') {
        cutoffDate = weekAgo;
      } else if (periodFilter === 'month') {
        cutoffDate = monthAgo;
      } else if (periodFilter === 'year') {
        cutoffDate = yearAgo;
      }
      
      filtered = filtered.filter(s => 
        s.deliveryDate && new Date(s.deliveryDate) >= cutoffDate
      );
    }
    
    // Sort by delivery date (newest first)
    filtered.sort((a, b) => {
      if (!a.deliveryDate || !b.deliveryDate) return 0;
      return new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime();
    });
    
    setFilteredShipments(filtered);
  };
  
  // Calculate earnings
  const totalEarnings = filteredShipments.reduce((total, s) => total + (s.price || 0), 0);
  const completedJobs = filteredShipments.length;
  
  // Group earnings by month for the chart
  const getMonthlyEarnings = () => {
    const monthlyData: Record<string, number> = {};
    
    filteredShipments.forEach(s => {
      if (s.deliveryDate) {
        const date = new Date(s.deliveryDate);
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = 0;
        }
        
        monthlyData[monthYear] += (s.price || 0);
      }
    });
    
    return monthlyData;
  };
  
  const monthlyEarnings = getMonthlyEarnings();
  
  // Format month name
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  
  return (
    <div className="animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Earnings</h1>
          <p className="text-neutral-600">Track your completed deliveries and earnings</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="btn-outline">
            <Download className="mr-2 h-5 w-5" />
            Download Statement
          </button>
        </div>
      </div>
      
      {/* Period Filter */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Earning Period</div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPeriodFilter('week')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                periodFilter === 'week'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setPeriodFilter('month')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                periodFilter === 'month'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setPeriodFilter('year')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                periodFilter === 'year'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              This Year
            </button>
            <button
              onClick={() => setPeriodFilter('all')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                periodFilter === 'all'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              All Time
            </button>
          </div>
        </div>
      </div>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="card flex items-center">
          <div className="p-4 rounded-lg bg-green-100 text-green-700 mr-5">
            <TrendingUp className="h-8 w-8" />
          </div>
          <div>
            <span className="text-neutral-600 text-sm">Total Earnings</span>
            <h3 className="text-3xl font-bold text-neutral-900">{totalEarnings.toLocaleString()} RWF</h3>
            <span className="text-sm text-neutral-500">
              {periodFilter === 'week' 
                ? 'Past 7 days' 
                : periodFilter === 'month' 
                  ? 'Past 30 days' 
                  : periodFilter === 'year' 
                    ? 'Past 12 months' 
                    : 'All time'}
            </span>
          </div>
        </div>

        <div className="card flex items-center">
          <div className="p-4 rounded-lg bg-blue-100 text-blue-700 mr-5">
            <Truck className="h-8 w-8" />
          </div>
          <div>
            <span className="text-neutral-600 text-sm">Completed Deliveries</span>
            <h3 className="text-3xl font-bold text-neutral-900">{completedJobs}</h3>
            <span className="text-sm text-neutral-500">
              {periodFilter === 'week' 
                ? 'Past 7 days' 
                : periodFilter === 'month' 
                  ? 'Past 30 days' 
                  : periodFilter === 'year' 
                    ? 'Past 12 months' 
                    : 'All time'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Earnings Chart */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Earnings Trend</h2>
          <div className="text-sm font-medium text-primary-600">
            {periodFilter === 'week' 
              ? 'Past 7 days' 
              : periodFilter === 'month' 
                ? 'Past 30 days' 
                : periodFilter === 'year' 
                  ? 'Past 12 months' 
                  : 'All time'}
          </div>
        </div>
        
        {Object.keys(monthlyEarnings).length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            No earnings data available for the selected period
          </div>
        ) : (
          <div className="h-64 w-full">
            {/* Bar chart for monthly earnings */}
            <div className="h-full flex items-end space-x-2">
              {Object.entries(monthlyEarnings).map(([month, amount], index) => {
                // Calculate height based on maximum amount
                const maxAmount = Math.max(...Object.values(monthlyEarnings));
                const height = (amount / maxAmount) * 100;
                
                return (
                  <div key={month} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-primary-500 hover:bg-primary-600 transition-all rounded-t-sm"
                      style={{ height: `${height}%` }}
                      title={`${formatMonth(month)}: ${amount.toLocaleString()} RWF`}
                    ></div>
                    <div className="text-xs text-neutral-500 mt-2 truncate w-full text-center">
                      {formatMonth(month)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Completed Deliveries */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Completed Deliveries</h2>
          <div className="text-sm font-medium text-primary-600">
            {completedJobs} trips completed
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-6 text-neutral-500">Loading earnings data...</div>
        ) : filteredShipments.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <p className="mb-4">No completed deliveries for the selected period</p>
            <Link to="/trucker/jobs" className="btn-outline">
              Browse Available Jobs
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Delivery ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Delivery Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Business
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredShipments.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      <Link 
                        to={`/trucker/jobs/${delivery.id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        {delivery.id.substring(0, 8)}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                      {delivery.pickupLocation.name} → {delivery.deliveryLocation.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                      {delivery.deliveryDate ? new Date(delivery.deliveryDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                      {delivery.businessName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={delivery.paymentStatus} type="payment" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 text-right">
                      {delivery.price ? `${delivery.price.toLocaleString()} RWF` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-neutral-50">
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-sm font-medium text-neutral-900 text-right">
                    Total:
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-neutral-900 text-right">
                    {totalEarnings.toLocaleString()} RWF
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EarningsPage;