import { Shipment, Invoice } from '../types/shipment';

// Locations in Rwanda
const rwandaLocations = [
  { name: 'Kigali', address: 'KN 5 Ave, Kigali' },
  { name: 'Musanze', address: 'Main Street, Musanze' },
  { name: 'Butare', address: 'University Road, Butare' },
  { name: 'Gisenyi', address: 'Lake Kivu Road, Gisenyi' },
  { name: 'Rwamagana', address: 'Market Street, Rwamagana' },
  { name: 'Muhanga', address: 'Central Road, Muhanga' },
  { name: 'Nyagatare', address: 'Eastern Province, Nyagatare' },
  { name: 'Huye', address: 'Southern Road, Huye' }
];

// Mock shipments data
export const mockShipments: Shipment[] = [
  {
    id: 'ship-001',
    businessId: 'b-123',
    businessName: 'ABC Distributors',
    truckerId: 't-123',
    truckerName: 'Jean Mutabazi',
    status: 'delivered',
    loadType: 'agricultural',
    truckType: 'medium',
    weight: 2500,
    pickupLocation: rwandaLocations[0],
    deliveryLocation: rwandaLocations[2],
    pickupDate: '2025-01-15T09:00:00Z',
    deliveryDate: '2025-01-15T14:30:00Z',
    description: 'Coffee beans in 50 sacks',
    price: 85000,
    paymentStatus: 'confirmed',
    createdAt: '2025-01-14T15:30:00Z',
    updatedAt: '2025-01-15T15:00:00Z',
    ebmReceiptNumber: 'EBM-785412'
  },
  {
    id: 'ship-002',
    businessId: 'b-123',
    businessName: 'ABC Distributors',
    truckerId: 't-456',
    truckerName: 'Olivier Kamanzi',
    status: 'in_transit',
    loadType: 'retail',
    truckType: 'large',
    weight: 3800,
    pickupLocation: rwandaLocations[0],
    deliveryLocation: rwandaLocations[3],
    pickupDate: '2025-02-18T08:00:00Z',
    description: 'Retail goods for supermarket',
    price: 120000,
    paymentStatus: 'pending',
    createdAt: '2025-02-16T11:20:00Z',
    updatedAt: '2025-02-18T08:30:00Z'
  },
  {
    id: 'ship-003',
    businessId: 'b-123',
    businessName: 'ABC Distributors',
    status: 'quoted',
    loadType: 'agricultural',
    truckType: 'medium',
    weight: 1800,
    pickupLocation: rwandaLocations[4],
    deliveryLocation: rwandaLocations[0],
    pickupDate: '2025-02-25T10:00:00Z',
    description: 'Fresh produce for market',
    specialInstructions: 'Handle with care, perishable goods',
    price: 75000,
    paymentStatus: 'pending',
    createdAt: '2025-02-20T09:15:00Z',
    updatedAt: '2025-02-20T09:30:00Z'
  },
  {
    id: 'ship-004',
    businessId: 'b-789',
    businessName: 'Kigali Food Supplies',
    truckerId: 't-123',
    truckerName: 'Jean Mutabazi',
    status: 'delivered',
    loadType: 'retail',
    truckType: 'refrigerated',
    weight: 1200,
    pickupLocation: rwandaLocations[1],
    deliveryLocation: rwandaLocations[0],
    pickupDate: '2025-01-20T07:30:00Z',
    deliveryDate: '2025-01-20T12:45:00Z',
    description: 'Refrigerated dairy products',
    price: 95000,
    paymentStatus: 'confirmed',
    createdAt: '2025-01-18T16:20:00Z',
    updatedAt: '2025-01-20T13:00:00Z',
    ebmReceiptNumber: 'EBM-654789'
  },
  {
    id: 'ship-005',
    businessId: 'b-123',
    businessName: 'ABC Distributors',
    status: 'confirmed',
    loadType: 'construction',
    truckType: 'large',
    weight: 5000,
    pickupLocation: rwandaLocations[0],
    deliveryLocation: rwandaLocations[5],
    pickupDate: '2025-02-28T08:00:00Z',
    description: 'Construction materials',
    price: 150000,
    paymentStatus: 'pending',
    createdAt: '2025-02-22T10:40:00Z',
    updatedAt: '2025-02-22T14:15:00Z'
  },
  {
    id: 'ship-006',
    businessId: 'b-123',
    businessName: 'ABC Distributors',
    truckerId: 't-789',
    truckerName: 'Marie Uwase',
    status: 'delivered',
    loadType: 'furniture',
    truckType: 'medium',
    weight: 1500,
    pickupLocation: rwandaLocations[0],
    deliveryLocation: rwandaLocations[7],
    pickupDate: '2025-01-25T09:30:00Z',
    deliveryDate: '2025-01-25T15:20:00Z',
    description: 'Office furniture',
    price: 85000,
    paymentStatus: 'confirmed',
    createdAt: '2025-01-23T13:10:00Z',
    updatedAt: '2025-01-25T15:45:00Z',
    ebmReceiptNumber: 'EBM-324567'
  },
  {
    id: 'ship-007',
    businessId: 'b-456',
    businessName: 'Rwanda Electronics',
    status: 'quoted',
    loadType: 'electronics',
    truckType: 'small',
    weight: 800,
    pickupLocation: rwandaLocations[0],
    deliveryLocation: rwandaLocations[6],
    pickupDate: '2025-03-05T10:00:00Z',
    description: 'Electronic equipment and accessories',
    specialInstructions: 'Fragile items, handle with extreme care',
    price: 70000,
    paymentStatus: 'pending',
    createdAt: '2025-02-28T11:30:00Z',
    updatedAt: '2025-02-28T11:45:00Z'
  }
];

// Mock invoices data
export const mockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    businessId: 'b-123',
    businessName: 'ABC Distributors',
    month: '2025-01',
    shipments: mockShipments.filter(s => 
      s.businessId === 'b-123' && 
      s.status === 'delivered' && 
      s.createdAt.startsWith('2025-01')
    ),
    totalAmount: 170000, // Sum of shipment prices
    status: 'paid',
    dueDate: '2025-02-15T00:00:00Z',
    createdAt: '2025-02-01T10:00:00Z',
    paidAt: '2025-02-10T14:30:00Z'
  },
  {
    id: 'inv-002',
    businessId: 'b-789',
    businessName: 'Kigali Food Supplies',
    month: '2025-01',
    shipments: mockShipments.filter(s => 
      s.businessId === 'b-789' && 
      s.status === 'delivered' && 
      s.createdAt.startsWith('2025-01')
    ),
    totalAmount: 95000,
    status: 'paid',
    dueDate: '2025-02-15T00:00:00Z',
    createdAt: '2025-02-01T11:30:00Z',
    paidAt: '2025-02-08T09:15:00Z'
  },
  {
    id: 'inv-003',
    businessId: 'b-123',
    businessName: 'ABC Distributors',
    month: '2025-02',
    shipments: [], // This will be populated when generating the invoice for the current month
    totalAmount: 0, // Will be calculated based on shipments
    status: 'pending',
    dueDate: '2025-03-15T00:00:00Z',
    createdAt: '2025-03-01T09:45:00Z'
  }
];