import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getBusinessInvoices, generateMonthlyInvoice } from '../../services/apiService';
import { Invoice } from '../../types/shipment';
import { FileText, Download, Plus, Calendar, Search } from 'lucide-react';

const Invoices: React.FC = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid'>('all');
  
  const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM format
  
  useEffect(() => {
    const fetchInvoices = async () => {
      if (user) {
        try {
          setLoading(true);
          const data = await getBusinessInvoices(user.id);
          setInvoices(data);
          setFilteredInvoices(data);
        } catch (error) {
          console.error('Error fetching invoices:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchInvoices();
  }, [user]);
  
  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, invoices]);
  
  const applyFilters = () => {
    let filtered = [...invoices];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(invoice => 
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.month.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }
    
    setFilteredInvoices(filtered);
  };
  
  const handleGenerateInvoice = async () => {
    if (!user) return;
    
    try {
      setGeneratingInvoice(true);
      
      const newInvoice = await generateMonthlyInvoice(
        user.id,
        user.name,
        currentMonth
      );
      
      setInvoices([newInvoice, ...invoices]);
      setFilteredInvoices([newInvoice, ...filteredInvoices]);
    } catch (error) {
      console.error('Error generating invoice:', error);
    } finally {
      setGeneratingInvoice(false);
    }
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };
  
  // Helper to format month string (YYYY-MM) to readable format
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  return (
    <div className="animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Monthly Invoices</h1>
          <p className="text-neutral-600">View and download your consolidated monthly invoices</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            onClick={handleGenerateInvoice}
            className="btn-primary"
            disabled={generatingInvoice}
          >
            <Plus className="mr-2 h-5 w-5" />
            {generatingInvoice ? 'Generating...' : 'Generate Current Invoice'}
          </button>
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
                placeholder="Search by invoice number or month"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-auto">
            <select
              className="select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'paid')}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
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
            <p className="mt-4 text-neutral-600">Loading invoices...</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-lg font-medium text-neutral-900">No invoices found</h3>
            <p className="mt-2 text-neutral-600">
              {invoices.length === 0 
                ? "You don't have any monthly invoices yet." 
                : "No invoices match your current filters."}
            </p>
            {invoices.length === 0 && (
              <button 
                onClick={handleGenerateInvoice}
                className="btn-primary mt-4"
                disabled={generatingInvoice}
              >
                <Plus className="mr-2 h-5 w-5" />
                Generate Your First Invoice
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Shipments
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      {invoice.id.substring(0, 9)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                      {formatMonth(invoice.month)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                      {invoice.shipments.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      {invoice.totalAmount.toLocaleString()} RWF
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        invoice.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {invoice.status === 'paid' ? 'Paid' : 'Due'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/business/invoices/${invoice.id}`} 
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        View
                      </Link>
                      <a
                        href="#"
                        className="text-primary-600 hover:text-primary-900"
                        onClick={(e) => {
                          e.preventDefault();
                          // In a real app, this would download the invoice
                          alert('Download feature would be implemented here');
                        }}
                      >
                        Download
                      </a>
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

export default Invoices;