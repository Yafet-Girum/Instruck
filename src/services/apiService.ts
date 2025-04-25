import { Shipment, Invoice, ReceiptDetails } from '../types/shipment';
import { mockShipments, mockInvoices } from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Shipment API functions
export const getBusinessShipments = async (businessId: string): Promise<Shipment[]> => {
  await delay(800);
  return mockShipments.filter(shipment => shipment.businessId === businessId);
};

export const getTruckerShipments = async (truckerId: string): Promise<Shipment[]> => {
  await delay(800);
  return mockShipments.filter(shipment => shipment.truckerId === truckerId);
};

export const getAvailableShipments = async (): Promise<Shipment[]> => {
  await delay(800);
  return mockShipments.filter(shipment => 
    shipment.status === 'quoted' && !shipment.truckerId
  );
};

export const getShipmentById = async (shipmentId: string): Promise<Shipment | undefined> => {
  await delay(500);
  return mockShipments.find(shipment => shipment.id === shipmentId);
};

export const createShipment = async (shipmentData: Partial<Shipment>): Promise<Shipment> => {
  await delay(1000);
  
  // Create new shipment with mock data
  const newShipment: Shipment = {
    id: `ship-${Date.now()}`,
    businessId: shipmentData.businessId || '',
    businessName: shipmentData.businessName || '',
    status: 'quoted',
    loadType: shipmentData.loadType || 'retail',
    truckType: shipmentData.truckType || 'medium',
    weight: shipmentData.weight || 0,
    volume: shipmentData.volume,
    pickupLocation: shipmentData.pickupLocation || {
      name: '',
      address: '',
    },
    deliveryLocation: shipmentData.deliveryLocation || {
      name: '',
      address: '',
    },
    pickupDate: shipmentData.pickupDate || new Date().toISOString(),
    description: shipmentData.description,
    specialInstructions: shipmentData.specialInstructions,
    // Calculate a random price between 50,000 and 200,000 RWF
    price: Math.round((Math.random() * 150000 + 50000) / 1000) * 1000,
    paymentStatus: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // In a real app, we would send this to an API
  // For the prototype, we'll add it to our mock data
  mockShipments.unshift(newShipment);
  
  return newShipment;
};

export const updateShipmentStatus = async (
  shipmentId: string, 
  status: Shipment['status']
): Promise<Shipment | undefined> => {
  await delay(800);
  
  const shipment = mockShipments.find(s => s.id === shipmentId);
  if (shipment) {
    shipment.status = status;
    shipment.updatedAt = new Date().toISOString();
    
    // If the shipment is delivered, generate receipt number
    if (status === 'delivered') {
      shipment.ebmReceiptNumber = `EBM-${Math.floor(Math.random() * 1000000)}`;
    }
  }
  
  return shipment;
};

export const assignTruckerToShipment = async (
  shipmentId: string,
  truckerId: string,
  truckerName: string
): Promise<Shipment | undefined> => {
  await delay(800);
  
  const shipment = mockShipments.find(s => s.id === shipmentId);
  if (shipment) {
    shipment.truckerId = truckerId;
    shipment.truckerName = truckerName;
    shipment.status = 'assigned';
    shipment.updatedAt = new Date().toISOString();
  }
  
  return shipment;
};

// Invoice API functions
export const getBusinessInvoices = async (businessId: string): Promise<Invoice[]> => {
  await delay(800);
  return mockInvoices.filter(invoice => invoice.businessId === businessId);
};

export const getInvoiceById = async (invoiceId: string): Promise<Invoice | undefined> => {
  await delay(500);
  return mockInvoices.find(invoice => invoice.id === invoiceId);
};

export const generateMonthlyInvoice = async (
  businessId: string, 
  businessName: string, 
  month: string
): Promise<Invoice> => {
  await delay(1200);
  
  // Get all completed shipments for this business in the specified month
  const shipments = mockShipments.filter(shipment => 
    shipment.businessId === businessId &&
    shipment.status === 'delivered' &&
    shipment.paymentStatus === 'confirmed' &&
    shipment.createdAt.startsWith(month.substring(0, 7))
  );
  
  // Calculate total amount
  const totalAmount = shipments.reduce((sum, shipment) => sum + (shipment.price || 0), 0);
  
  // Create new invoice
  const newInvoice: Invoice = {
    id: `inv-${Date.now()}`,
    businessId,
    businessName,
    month,
    shipments,
    totalAmount,
    status: 'pending',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
    createdAt: new Date().toISOString(),
  };
  
  // In a real app, we would send this to an API
  mockInvoices.unshift(newInvoice);
  
  return newInvoice;
};

// Receipt API functions
export const generateReceipt = async (shipmentId: string): Promise<ReceiptDetails> => {
  await delay(1000);
  
  const shipment = mockShipments.find(s => s.id === shipmentId);
  
  if (!shipment) {
    throw new Error('Shipment not found');
  }
  
  // Generate mock receipt
  const receiptNumber = shipment.ebmReceiptNumber || `EBM-${Math.floor(Math.random() * 1000000)}`;
  const amount = shipment.price || 0;
  const taxAmount = amount * 0.18; // 18% VAT
  
  const receipt: ReceiptDetails = {
    receiptNumber,
    businessName: shipment.businessName,
    businessTIN: '102458976', // Mock business TIN
    truckerName: shipment.truckerName || 'Unknown Trucker',
    truckerTIN: '107654321', // Mock trucker TIN
    shipmentId: shipment.id,
    description: `Transport services from ${shipment.pickupLocation.name} to ${shipment.deliveryLocation.name}`,
    amount,
    taxAmount,
    totalAmount: amount + taxAmount,
    issueDate: new Date().toISOString(),
    rraVerificationCode: `RRA-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
  };
  
  // Update shipment with receipt info
  if (shipment && !shipment.ebmReceiptNumber) {
    shipment.ebmReceiptNumber = receiptNumber;
    shipment.paymentStatus = 'confirmed';
  }
  
  return receipt;
};