import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getBusinessShipments, getBusinessInvoices } from '../../services/apiService';
import { Shipment, Invoice } from '../../types/shipment';
import { Truck, Package, FileText, CreditCard, TrendingUp, ChevronRight, ArrowRight } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';

const BusinessDashboard: React.FC = () => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          setLoading(true);
          const [shipmentData, invoiceData] = await Promise.all([
            getBusinessShipments(user.id),
            getBusinessInvoices(user.id)
          ]);
          setShipments(shipmentData);
          setInvoices(invoiceData);
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
    ['quoted', 'confirmed', 'assigned', 'in_transit'].includes(s.status)
  ).length;
  
  const completedShipments = shipments.filter(s => s.status === 'delivered').length;
  
  const totalSpent = shipments
    .filter(s => s.status === 'delivered')
    .reduce((sum, s) => sum + (s.price || 0), 0);
  
  // Get recent shipments and invoices
  const recentShipments = shipments.slice(0, 3);
  const recentInvoices = invoices.slice(0, 3);

  return (
    <div className="animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Welcome, {user?.name}</h1>
          <p className="text-neutral-600">Manage your shipments and track logistics operations</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/business/shipments/create" className="btn-primary">
            <Truck className="mr-2 h-5 w-5" />
            Book New Shipment
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="card flex items-start">
          <div className="p-3 rounded-lg bg-blue-100 text-blue-700 mr-4">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <span className="text-neutral-600 text-sm">Active Shipments</span>
            <h3 className="text-2xl font-bold text-neutral-900">{activeShipments}</h3>
          </div>
        </div>

        <div className="card flex items-start">
          <div className="p-3 rounded-lg bg-green-100 text-green-700 mr-4">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <span className="text-neutral-600 text-sm">Completed Shipments</span>
            <h3 className="text-2xl font-bold text-neutral-900">{completedShipments}</h3>
          </div>
        </div>

        <div className="card flex items-start">
          <div className="p-3 rounded-lg bg-purple-100 text-purple-700 mr-4">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <span className="text-neutral-600 text-sm">Total Spent</span>
            <h3 className="text-2xl font-bold text-neutral-900">{totalSpent.toLocaleString()} RWF</h3>
          </div>
        </div>
      </div>

      {/* Shipment Analysis */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Shipment Analysis</h2>
          <div className="text-sm font-medium text-primary-600">Last 30 days</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <span className="text-neutral-500 text-sm mb-2">Shipment Growth</span>
            {/* Simple bar chart */}
            <div className="h-32 flex items-end space-x-2">
              <div className="w-1/5 bg-primary-200 rounded-t-md" style={{height: '40%'}}></div>
              <div className="w-1/5 bg-primary-300 rounded-t-md" style={{height: '60%'}}></div>
              <div className="w-1/5 bg-primary-400 rounded-t-md" style={{height: '50%'}}></div>
              <div className="w-1/5 bg-primary-500 rounded-t-md" style={{height: '75%'}}></div>
              <div className="w-1/5 bg-primary-600 rounded-t-md" style={{height: '85%'}}></div>
            </div>
            <div className="text-sm text-neutral-600 flex justify-between mt-2">
              <span>Jan</span>
              <span>Feb</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-neutral-500 text-sm mb-2">Shipment Types</span>
            {/* Simple pie chart */}
            <div className="h-32 flex justify-center items-center">
              <div className="w-24 h-24 rounded-full border-8 border-primary-500 relative">
                <div className="absolute top-0 right-0 bottom-0 left-0 border-8 border-r-transparent border-b-transparent border-accent-500 rounded-full transform rotate-45"></div>
                <div className="absolute top-0 right-0 bottom-0 left-0 border-8 border-l-transparent border-t-transparent border-r-transparent border-b-primary-300 rounded-full"></div>
              </div>
            </div>
            <div className="text-xs text-neutral-600 grid grid-cols-3 gap-2 mt-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary-500 rounded-sm mr-1"></div>
                <span>Retail</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-accent-500 rounded-sm mr-1"></div>
                <span>Agri</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary-300 rounded-sm mr-1"></div>
                <span>Other</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-neutral-500 text-sm mb-2">Cost Savings</span>
            {/* Line chart */}
            <div className="h-32 flex items-center relative">
              <svg className="w-full h-full" viewBox="0 0 100 60">
                <path 
                  d="M0,50 L20,45 L40,48 L60,30 L80,20 L100,5" 
                  fill="none" 
                  stroke="#0f766e" 
                  strokeWidth="2"
                />
                <path 
                  d="M0,50 L20,45 L40,48 L60,30 L80,20 L100,5 L100,60 L0,60 Z" 
                  fill="rgba(15, 118, 110, 0.1)" 
                />
              </svg>
            </div>
            <div className="text-sm text-neutral-600 flex justify-between mt-2">
              <span>15% vs market</span>
              <span>+5% MoM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Shipments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Shipments</h2>
              <Link to="/business/shipments" className="text-sm font-medium text-primary-600 flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            {loading ? (
              <div className="text-center py-6 text-neutral-500">Loading shipments...</div>
            ) : recentShipments.length === 0 ? (
              <div className="text-center py-6 text-neutral-500">
                <p className="mb-4">No shipments found</p>
                <Link to="/business/shipments/create" className="btn-outline">
                  Book Your First Shipment
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-neutral-200">
                {recentShipments.map((shipment) => (
                  <div key={shipment.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link 
                          to={`/business/shipments/${shipment.id}`} 
                          className="font-medium text-neutral-900 hover:text-primary-600"
                        >
                          {shipment.pickupLocation.name} to {shipment.deliveryLocation.name}
                        </Link>
                        <p className="text-sm text-neutral-600">{shipment.loadType} • {shipment.weight} kg</p>
                      </div>
                      <StatusBadge status={shipment.status} />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-neutral-500">
                        {new Date(shipment.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm font-medium">
                        {shipment.price ? `${shipment.price.toLocaleString()} RWF` : '-'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Invoices */}
        <div>
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Invoices</h2>
              <Link to="/business/invoices" className="text-sm font-medium text-primary-600 flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            {loading ? (
              <div className="text-center py-6 text-neutral-500">Loading invoices...</div>
            ) : recentInvoices.length === 0 ? (
              <div className="text-center py-6 text-neutral-500">
                <p>No invoices found</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-200">
                {recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <Link 
                        to={`/business/invoices/${invoice.id}`}
                        className="font-medium text-neutral-900 hover:text-primary-600"
                      >
                        Invoice #{invoice.id.substring(4, 10)}
                      </Link>
                      <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                        invoice.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {invoice.status === 'paid' ? 'Paid' : 'Due'}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-neutral-500">
                        {invoice.month.substring(0, 7)}
                      </div>
                      <div className="text-sm font-semibold">
                        {invoice.totalAmount.toLocaleString()} RWF
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;