import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getInvoiceById } from '../../services/apiService';
import { Invoice } from '../../types/shipment';
import { jsPDF } from 'jspdf';
import { 
  FileText, 
  Download, 
  ChevronLeft, 
  CreditCard, 
  Clock, 
  CheckCircle,
  Calendar,
  Truck
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';

const InvoiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  useEffect(() => {
    const fetchInvoice = async () => {
      if (id) {
        try {
          setLoading(true);
          const data = await getInvoiceById(id);
          if (data) {
            setInvoice(data);
          }
        } catch (error) {
          console.error('Error fetching invoice:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchInvoice();
  }, [id]);
  
  const handlePayment = async () => {
    if (!invoice) return;
    
    try {
      setProcessingPayment(true);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update invoice status
      setInvoice({
        ...invoice,
        status: 'paid',
        paidAt: new Date().toISOString()
      });
      
      setShowPaymentModal(false);
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setProcessingPayment(false);
    }
  };
  
  const downloadInvoice = () => {
    if (!invoice) return;
    
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Instruck Monthly Invoice', 105, 20, { align: 'center' });
    
    // Invoice details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice No: ${invoice.id}`, 20, 40);
    doc.text(`Issue Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 20, 50);
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 20, 60);
    doc.text(`Status: ${invoice.status.toUpperCase()}`, 20, 70);
    
    // Business details
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Business Details', 20, 90);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${invoice.businessName}`, 20, 100);
    doc.text(`Business ID: ${invoice.businessId}`, 20, 110);
    
    // Invoice summary
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice Summary', 20, 130);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Month: ${formatMonth(invoice.month)}`, 20, 140);
    doc.text(`Total Shipments: ${invoice.shipments.length}`, 20, 150);
    doc.text(`Total Amount: ${invoice.totalAmount.toLocaleString()} RWF`, 20, 160);
    
    // Shipment details
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Shipment Details', 20, 180);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Table header
    let y = 190;
    doc.text('ID', 20, y);
    doc.text('Route', 50, y);
    doc.text('Date', 110, y);
    doc.text('Status', 145, y);
    doc.text('Amount', 175, y);
    
    doc.line(20, y + 2, 190, y + 2);
    y += 10;
    
    // Table rows
    invoice.shipments.forEach((shipment, index) => {
      // Check if we need a new page
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      
      doc.text(shipment.id.substring(0, 8), 20, y);
      doc.text(`${shipment.pickupLocation.name} → ${shipment.deliveryLocation.name}`, 50, y);
      doc.text(new Date(shipment.createdAt).toLocaleDateString(), 110, y);
      doc.text(shipment.status, 145, y);
      doc.text(`${shipment.price?.toLocaleString() || 0} RWF`, 175, y);
      
      y += 10;
    });
    
    // Footer
    doc.setFontSize(10);
    doc.text('This is an official invoice from Instruck.', 105, 280, { align: 'center' });
    
    // Save the PDF
    doc.save(`invoice-${invoice.id}.pdf`);
  };
  
  // Helper to format month string (YYYY-MM) to readable format
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  if (loading && !invoice) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
        <p className="ml-4 text-neutral-600">Loading invoice details...</p>
      </div>
    );
  }
  
  if (!invoice) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-neutral-900">Invoice not found</h3>
        <p className="mt-2 text-neutral-600">The invoice you're looking for doesn't exist or you don't have access to it.</p>
        <Link to="/business/invoices" className="btn-outline mt-4">
          Back to Invoices
        </Link>
      </div>
    );
  }
  
  return (
    <div className="animate-slide-up">
      {/* Back Link */}
      <Link 
        to="/business/invoices" 
        className="flex items-center text-neutral-600 hover:text-neutral-900 mb-6"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Invoices
      </Link>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-neutral-900 mr-4">
              Invoice #{invoice.id.substring(0, 8)}
            </h1>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              invoice.status === 'paid' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {invoice.status === 'paid' ? 'Paid' : 'Due'}
            </span>
          </div>
          <p className="text-neutral-600 mt-1">
            {formatMonth(invoice.month)} • {invoice.shipments.length} shipments
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          {invoice.status === 'pending' && (
            <button 
              onClick={() => setShowPaymentModal(true)} 
              className="btn-primary"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Pay Invoice
            </button>
          )}
          
          <button 
            onClick={downloadInvoice} 
            className="btn-outline"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Invoice
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Details */}
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-6">Invoice Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-neutral-50 rounded-lg p-4">
                <p className="text-sm text-neutral-500 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-neutral-900">{invoice.totalAmount.toLocaleString()} RWF</p>
              </div>
              
              <div className="bg-neutral-50 rounded-lg p-4">
                <p className="text-sm text-neutral-500 mb-1">Due Date</p>
                <p className="text-lg font-medium text-neutral-900">{new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
              
              <div className="bg-neutral-50 rounded-lg p-4">
                <p className="text-sm text-neutral-500 mb-1">Status</p>
                <div className="flex items-center">
                  {invoice.status === 'paid' ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                      <p className="text-lg font-medium text-green-700">Paid</p>
                    </>
                  ) : (
                    <>
                      <Clock className="h-5 w-5 text-amber-500 mr-1" />
                      <p className="text-lg font-medium text-amber-700">Due</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Shipments ({invoice.shipments.length})</h2>
              <div className="text-sm font-medium text-primary-600">{formatMonth(invoice.month)}</div>
            </div>
            
            {invoice.shipments.length === 0 ? (
              <div className="text-center py-6 text-neutral-500">
                No shipments in this invoice
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
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Receipt
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {invoice.shipments.map((shipment) => (
                      <tr key={shipment.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                          <Link 
                            to={`/business/shipments/${shipment.id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            {shipment.id.substring(0, 8)}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                          {shipment.pickupLocation.name} → {shipment.deliveryLocation.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                          {new Date(shipment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={shipment.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                          {shipment.ebmReceiptNumber || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 text-right">
                          {shipment.price ? `${shipment.price.toLocaleString()} RWF` : '-'}
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
                        {invoice.totalAmount.toLocaleString()} RWF
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card mb-6">
            <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>
            
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-neutral-500 mb-1">Invoice Number</dt>
                <dd className="font-medium text-neutral-900">{invoice.id}</dd>
              </div>
              
              <div>
                <dt className="text-sm text-neutral-500 mb-1">Issue Date</dt>
                <dd className="font-medium text-neutral-900">{new Date(invoice.createdAt).toLocaleDateString()}</dd>
              </div>
              
              <div>
                <dt className="text-sm text-neutral-500 mb-1">Due Date</dt>
                <dd className="font-medium text-neutral-900">{new Date(invoice.dueDate).toLocaleDateString()}</dd>
              </div>
              
              <div>
                <dt className="text-sm text-neutral-500 mb-1">Invoice Period</dt>
                <dd className="font-medium text-neutral-900">{formatMonth(invoice.month)}</dd>
              </div>
              
              {invoice.status === 'paid' && invoice.paidAt && (
                <div>
                  <dt className="text-sm text-neutral-500 mb-1">Payment Date</dt>
                  <dd className="font-medium text-neutral-900">{new Date(invoice.paidAt).toLocaleDateString()}</dd>
                </div>
              )}
            </dl>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Business Details</h3>
            
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-neutral-500 mb-1">Business Name</dt>
                <dd className="font-medium text-neutral-900">{invoice.businessName}</dd>
              </div>
              
              <div>
                <dt className="text-sm text-neutral-500 mb-1">Business ID</dt>
                <dd className="font-medium text-neutral-900">{invoice.businessId}</dd>
              </div>
              
              <div className="pt-4 border-t border-neutral-200">
                <dt className="text-sm text-neutral-500 mb-1">For Support</dt>
                <dd className="text-neutral-900">
                  <p className="mb-1">Email: support@instruck.com</p>
                  <p>Phone: +250 788 123 456</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold">Pay Invoice</h2>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="text-neutral-500 hover:text-neutral-700"
                  disabled={processingPayment}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <div className="bg-neutral-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-neutral-500 mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-neutral-900">{invoice.totalAmount.toLocaleString()} RWF</p>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-neutral-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    className="select"
                    defaultValue="mtn"
                  >
                    <option value="mtn">MTN Mobile Money</option>
                    <option value="airtel">Airtel Money</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="card">Credit/Debit Card</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-neutral-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    className="input"
                    placeholder="e.g., 078 123 4567"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm text-neutral-600">
                      I authorize Instruck to process this payment and agree to the terms of service
                    </span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={handlePayment}
                  className="btn-primary w-full py-3"
                  disabled={processingPayment}
                >
                  {processingPayment ? (
                    <>
                      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      Pay {invoice.totalAmount.toLocaleString()} RWF
                    </>
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

export default InvoiceDetails;