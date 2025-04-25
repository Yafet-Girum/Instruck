import React from 'react';
import { ShipmentStatus, PaymentStatus } from '../../types/shipment';

interface StatusBadgeProps {
  status: ShipmentStatus | PaymentStatus;
  type?: 'shipment' | 'payment';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'shipment' }) => {
  const getStatusConfig = () => {
    // Shipment statuses
    if (type === 'shipment') {
      switch (status) {
        case 'pending':
          return { classes: 'bg-blue-100 text-blue-800', label: 'Pending' };
        case 'quoted':
          return { classes: 'bg-purple-100 text-purple-800', label: 'Quoted' };
        case 'confirmed':
          return { classes: 'bg-indigo-100 text-indigo-800', label: 'Confirmed' };
        case 'assigned':
          return { classes: 'bg-amber-100 text-amber-800', label: 'Assigned' };
        case 'in_transit':
          return { classes: 'bg-yellow-100 text-yellow-800', label: 'In Transit' };
        case 'delivered':
          return { classes: 'bg-green-100 text-green-800', label: 'Delivered' };
        case 'canceled':
          return { classes: 'bg-red-100 text-red-800', label: 'Canceled' };
        default:
          return { classes: 'bg-neutral-100 text-neutral-800', label: status };
      }
    }
    
    // Payment statuses
    switch (status) {
      case 'pending':
        return { classes: 'bg-yellow-100 text-yellow-800', label: 'Pending' };
      case 'confirmed':
        return { classes: 'bg-green-100 text-green-800', label: 'Confirmed' };
      case 'invoiced':
        return { classes: 'bg-blue-100 text-blue-800', label: 'Invoiced' };
      case 'paid':
        return { classes: 'bg-green-100 text-green-800', label: 'Paid' };
      default:
        return { classes: 'bg-neutral-100 text-neutral-800', label: status };
    }
  };

  const { classes, label } = getStatusConfig();

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
};

export default StatusBadge;