import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getShipmentById, updateShipmentStatus, generateReceipt } from '../../services/apiService';
import { Shipment, ReceiptDetails } from '../../types/shipment';
import { jsPDF } from 'jspdf';
import { 
  Truck, 
  Map, 
  Package, 
  Calendar, 
  Clock, 
  FileText, 
  Download, 
  ChevronLeft,
  Phone,
  CheckCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';

const ShipmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [receipt, setReceipt] = useState<ReceiptDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  
  useEffect(() => {
    const fetchShipment = async () => {
      if (id) {
        try {
          setLoading(true);
          const data = await getShipmentById(id);
          if (data) {
            setShipment(data);
          }
        } catch (error) {
          console.error('Error fetching shipment:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchShipment();
  }, [id]);
  
  const handleStatusUpdate = async (status: Shipment['status']) => {
    if (!shipment || !id) return;
    
    try {
      setLoading(true);
      const updated = await updateShipmentStatus(id, status);
      if (updated) {
        setShipment(updated);
      }
    } catch (error) {
      console.error('Error updating shipment status:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGenerateReceipt = async () => {
    if (!shipment || !id) return;
    
    try {
      setReceiptLoading(true);
      const receiptData = await generateReceipt(id);
      setReceipt(receiptData);
      setShowReceiptModal(true);
    } catch (error) {
      console.error('Error generating receipt:', error);
    } finally {
      setReceiptLoading(false);
    }
  };
  
  const downloadReceipt = () => {
    if (!receipt || !shipment) return;
    
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Instruck Receipt', 105, 20, { align: 'center' });
    
    // Receipt details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Receipt No: ${receipt.receiptNumber}`, 20, 40);
    doc.text(`Issue Date: ${new Date(receipt.issueDate).toLocaleDateString()}`, 20, 50);
    doc.text(`RRA Verification Code: ${receipt.rraVerificationCode}`, 20, 60);
    
    // Business details
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Business Details', 20, 80);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${receipt.businessName}`, 20, 90);
    doc.text(`TIN: ${receipt.businessTIN}`, 20, 100);
    
    // Trucker details
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Trucker Details', 20, 120);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${receipt.truckerName}`, 20, 130);
    doc.text(`TIN: ${receipt.truckerTIN}`, 20, 140);
    
    // Service details
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Service Details', 20, 160);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Shipment ID: ${receipt.shipmentId}`, 20, 170);
    doc.text(`Description: ${receipt.description}`, 20, 180);
    doc.text(`Route: ${shipment.pickupLocation.name} to ${shipment.deliveryLocation.name}`, 20, 190);
    
    // Pricing
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Pricing', 20, 210);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Service Amount: ${receipt.amount.toLocaleString()} RWF`, 20, 220);
    doc.text(`VAT (18%): ${receipt.taxAmount.toLocaleString()} RWF`, 20, 230);
    doc.text(`Total Amount: ${receipt.totalAmount.toLocaleString()} RWF`, 20, 240);
    
    // Footer
    doc.setFontSize(10);
    doc.text('This is an official RRA-compliant electronic receipt.', 105, 270, { align: 'center' });
    doc.text('Thank you for using Instruck!', 105, 280, { align: 'center' });
    
    // Save the PDF
    doc.save(`receipt-${receipt.receiptNumber}.pdf`);
  };
  
  if (loading && !shipment) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
        <p className="ml-4 text-neutral-600">Loading shipment details...</p>
      </div>
    );
  }
  
  if (!shipment) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-neutral-900">Shipment not found</h3>
        <p className="mt-2 text-neutral-600">The shipment you're looking for doesn't exist or you don't have access to it.</p>
        <Link to="/business/shipments" className="btn-outline mt-4">
          Back to Shipments
        </Link>
      </div>
    );
  }
  
  return (
    <div className="animate-slide-up">
      {/* Back Link */}
      <Link 
        to="/business/shipments" 
        className="flex items-center text-neutral-600 hover:text-neutral-900 mb-6"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Shipments
      </Link>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-neutral-900 mr-4">
              Shipment #{shipment.id.substring(0, 8)}
            </h1>
            <StatusBadge status={shipment.status} />
          </div>
          <p className="text-neutral-600 mt-1">
            {shipment.pickupLocation.name} to {shipment.deliveryLocation.name}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          {shipment.status === 'quoted' && (
            <button 
              onClick={() => handleStatusUpdate('confirmed')} 
              className="btn-primary"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Confirm Booking
            </button>
          )}
          
          {shipment.status === 'delivered' && !shipment.ebmReceiptNumber && (
            <button 
              onClick={handleGenerateReceipt} 
              className="btn-primary"
              disabled={receiptLoading}
            >
              <FileText className="mr-2 h-5 w-5" />
              {receiptLoading ? 'Generating...' : 'Generate Receipt'}
            </button>
          )}
          
          {shipment.ebmReceiptNumber && (
            <button 
              onClick={handleGenerateReceipt} 
              className="btn-outline"
            >
              <Download className="mr-2 h-5 w-5" />
              View Receipt
            </button>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shipment Details */}
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-semibold mb-6">Shipment Details</h2>
          
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
                  <p className="font-medium text-neutral-900">{shipment.pickupLocation.name}</p>
                  <p className="text-sm text-neutral-600">{shipment.pickupLocation.address}</p>
                </div>
                
                <div className="relative pl-6">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-neutral-200 ml-1.5"></div>
                  <ArrowDown className="h-4 w-4 text-neutral-400 absolute left-0 top-1/2 transform -translate-y-1/2" />
                </div>
                
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Delivery Location</p>
                  <p className="font-medium text-neutral-900">{shipment.deliveryLocation.name}</p>
                  <p className="text-sm text-neutral-600">{shipment.deliveryLocation.address}</p>
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
                  <dd className="font-medium text-neutral-900">{shipment.loadType}</dd>
                </div>
                
                <div>
                  <dt className="text-sm text-neutral-500 mb-1">Truck Type</dt>
                  <dd className="font-medium text-neutral-900">{shipment.truckType}</dd>
                </div>
                
                <div>
                  <dt className="text-sm text-neutral-500 mb-1">Weight</dt>
                  <dd className="font-medium text-neutral-900">{shipment.weight} kg</dd>
                </div>
                
                {shipment.volume && (
                  <div>
                    <dt className="text-sm text-neutral-500 mb-1">Volume</dt>
                    <dd className="font-medium text-neutral-900">{shipment.volume} m³</dd>
                  </div>
                )}
                
                {shipment.description && (
                  <div>
                    <dt className="text-sm text-neutral-500 mb-1">Description</dt>
                    <dd className="text-neutral-900">{shipment.description}</dd>
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
                  <dt className="text-sm text-neutral-500 mb-1">Created At</dt>
                  <dd className="font-medium text-neutral-900">{new Date(shipment.createdAt).toLocaleString()}</dd>
                </div>
                
                <div>
                  <dt className="text-sm text-neutral-500 mb-1">Pickup Date</dt>
                  <dd className="font-medium text-neutral-900">{new Date(shipment.pickupDate).toLocaleString()}</dd>
                </div>
                
                {shipment.deliveryDate && (
                  <div>
                    <dt className="text-sm text-neutral-500 mb-1">Delivery Date</dt>
                    <dd className="font-medium text-neutral-900">{new Date(shipment.deliveryDate).toLocaleString()}</dd>
                  </div>
                )}
                
                {shipment.specialInstructions && (
                  <div>
                    <dt className="text-sm text-neutral-500 mb-1">Special Instructions</dt>
                    <dd className="text-neutral-900">{shipment.specialInstructions}</dd>
                  </div>
                )}
              </dl>
            </div>
            
            {/* Payment */}
            <div className="border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-700 mr-3">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-neutral-900">Payment</h3>
              </div>
              
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-neutral-500 mb-1">Price</dt>
                  <dd className="font-medium text-neutral-900">{shipment.price ? `${shipment.price.toLocaleString()} RWF` : '-'}</dd>
                </div>
                
                <div>
                  <dt className="text-sm text-neutral-500 mb-1">Payment Status</dt>
                  <dd className="font-medium">
                    <StatusBadge status={shipment.paymentStatus} type="payment" />
                  </dd>
                </div>
                
                {shipment.ebmReceiptNumber && (
                  <div>
                    <dt className="text-sm text-neutral-500 mb-1">EBM Receipt</dt>
                    <dd className="font-medium text-neutral-900">{shipment.ebmReceiptNumber}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
        
        {/* Status Sidebar */}
        <div className="lg:col-span-1">
          <div className="card mb-6">
            <h3 className="text-lg font-semibold mb-4">Shipment Status</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-medium text-neutral-900">Shipment Created</h4>
                  <p className="text-sm text-neutral-500">{new Date(shipment.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  shipment.status !== 'pending' ? 'bg-green-500 text-white' : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {shipment.status !== 'pending' ? <CheckCircle className="h-5 w-5" /> : '2'}
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-medium text-neutral-900">Price Quoted</h4>
                  <p className="text-sm text-neutral-500">
                    {shipment.status !== 'pending' 
                      ? `${shipment.price?.toLocaleString()} RWF` 
                      : 'Pending'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  ['confirmed', 'assigned', 'in_transit', 'delivered'].includes(shipment.status) 
                    ? 'bg-green-500 text-white' 
                    : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {['confirmed', 'assigned', 'in_transit', 'delivered'].includes(shipment.status) 
                    ? <CheckCircle className="h-5 w-5" /> 
                    : '3'}
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-medium text-neutral-900">Booking Confirmed</h4>
                  <p className="text-sm text-neutral-500">
                    {['confirmed', 'assigned', 'in_transit', 'delivered'].includes(shipment.status)
                      ? 'Booking has been confirmed'
                      : shipment.status === 'quoted'
                        ? 'Waiting for confirmation'
                        : 'Pending'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  ['assigned', 'in_transit', 'delivered'].includes(shipment.status) 
                    ? 'bg-green-500 text-white' 
                    : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {['assigned', 'in_transit', 'delivered'].includes(shipment.status) 
                    ? <CheckCircle className="h-5 w-5" /> 
                    : '4'}
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-medium text-neutral-900">Trucker Assigned</h4>
                  <p className="text-sm text-neutral-500">
                    {['assigned', 'in_transit', 'delivered'].includes(shipment.status) && shipment.truckerName
                      ? shipment.truckerName
                      : 'Pending'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  ['in_transit', 'delivered'].includes(shipment.status) 
                    ? 'bg-green-500 text-white' 
                    : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {['in_transit', 'delivered'].includes(shipment.status) 
                    ? <CheckCircle className="h-5 w-5" /> 
                    : '5'}
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-medium text-neutral-900">In Transit</h4>
                  <p className="text-sm text-neutral-500">
                    {shipment.status === 'in_transit'
                      ? 'Shipment is on the way'
                      : shipment.status === 'delivered'
                        ? 'Completed'
                        : 'Pending'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  shipment.status === 'delivered' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {shipment.status === 'delivered' 
                    ? <CheckCircle className="h-5 w-5" /> 
                    : '6'}
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-medium text-neutral-900">Delivered</h4>
                  <p className="text-sm text-neutral-500">
                    {shipment.status === 'delivered' && shipment.deliveryDate
                      ? new Date(shipment.deliveryDate).toLocaleString()
                      : 'Pending'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  shipment.status === 'delivered' && shipment.ebmReceiptNumber
                    ? 'bg-green-500 text-white' 
                    : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {shipment.status === 'delivered' && shipment.ebmReceiptNumber
                    ? <CheckCircle className="h-5 w-5" /> 
                    : '7'}
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-medium text-neutral-900">Receipt Generated</h4>
                  <p className="text-sm text-neutral-500">
                    {shipment.status === 'delivered' && shipment.ebmReceiptNumber
                      ? shipment.ebmReceiptNumber
                      : 'Pending'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Trucker Info Card */}
          {shipment.truckerId && shipment.truckerName && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Trucker Information</h3>
              
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Trucker" 
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="font-medium text-neutral-900">{shipment.truckerName}</h4>
                  <p className="text-sm text-neutral-600">ID: {shipment.truckerId}</p>
                </div>
              </div>
              
              <div className="border-t border-neutral-200 pt-4 mt-4">
                <a 
                  href={`tel:+250789123456`} 
                  className="flex items-center justify-center py-2 px-4 border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Trucker
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Receipt Modal */}
      {showReceiptModal && receipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold">Receipt #{receipt.receiptNumber}</h2>
                <button 
                  onClick={() => setShowReceiptModal(false)}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-green-800">This receipt is RRA-compliant and verified</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-neutral-500">Receipt Number</p>
                    <p className="font-medium">{receipt.receiptNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Issue Date</p>
                    <p className="font-medium">{new Date(receipt.issueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">RRA Verification Code</p>
                    <p className="font-medium">{receipt.rraVerificationCode}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-b border-neutral-200 mb-4 pb-4">
                <h3 className="font-semibold mb-2">Business Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-500">Name</p>
                    <p className="font-medium">{receipt.businessName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">TIN</p>
                    <p className="font-medium">{receipt.businessTIN}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-b border-neutral-200 mb-4 pb-4">
                <h3 className="font-semibold mb-2">Trucker Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-500">Name</p>
                    <p className="font-medium">{receipt.truckerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">TIN</p>
                    <p className="font-medium">{receipt.truckerTIN}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-b border-neutral-200 mb-4 pb-4">
                <h3 className="font-semibold mb-2">Service Details</h3>
                <div>
                  <p className="text-sm text-neutral-500">Description</p>
                  <p className="font-medium">{receipt.description}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Pricing</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Service Amount:</span>
                    <span className="font-medium">{receipt.amount.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">VAT (18%):</span>
                    <span className="font-medium">{receipt.taxAmount.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-neutral-200 pt-2 mt-2">
                    <span>Total Amount:</span>
                    <span>{receipt.totalAmount.toLocaleString()} RWF</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={downloadReceipt}
                  className="btn-primary"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Receipt
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

export default ShipmentDetails;