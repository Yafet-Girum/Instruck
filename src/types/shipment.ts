export type ShipmentStatus = 
  | 'pending' 
  | 'quoted' 
  | 'confirmed' 
  | 'assigned' 
  | 'in_transit' 
  | 'delivered' 
  | 'canceled';

export type LoadType = 
  | 'agricultural' 
  | 'construction' 
  | 'retail' 
  | 'furniture' 
  | 'electronics' 
  | 'other';

export type TruckType = 
  | 'small' 
  | 'medium' 
  | 'large' 
  | 'refrigerated';

export type PaymentStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'invoiced' 
  | 'paid';

export interface Location {
  name: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Shipment {
  id: string;
  businessId: string;
  businessName: string;
  truckerId?: string;
  truckerName?: string;
  status: ShipmentStatus;
  loadType: LoadType;
  truckType: TruckType;
  weight: number; // in kg
  volume?: number; // in cubic meters
  pickupLocation: Location;
  deliveryLocation: Location;
  pickupDate: string;
  deliveryDate?: string;
  description?: string;
  specialInstructions?: string;
  price?: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  ebmReceiptNumber?: string;
}

export interface Invoice {
  id: string;
  businessId: string;
  businessName: string;
  month: string; // Format: "YYYY-MM"
  shipments: Shipment[];
  totalAmount: number;
  status: 'pending' | 'paid';
  dueDate: string;
  createdAt: string;
  paidAt?: string;
}

export interface ReceiptDetails {
  receiptNumber: string;
  businessName: string;
  businessTIN: string;
  truckerName: string;
  truckerTIN: string;
  shipmentId: string;
  description: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  issueDate: string;
  rraVerificationCode: string;
}