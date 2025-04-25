import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  totalBusinesses: number;
  totalTruckers: number;
  activeShipments: number;
  completedShipments: number;
  totalRevenue: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBusinesses: 0,
    totalTruckers: 0,
    activeShipments: 0,
    completedShipments: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total businesses
        const { count: businessCount } = await supabase
          .from('businesses')
          .select('*', { count: 'exact', head: true });

        // Get total truckers
        const { count: truckerCount } = await supabase
          .from('truckers')
          .select('*', { count: 'exact', head: true });

        // Get active shipments
        const { count: activeCount } = await supabase
          .from('shipments')
          .select('*', { count: 'exact', head: true })
          .in('status', ['pending', 'assigned', 'in_transit']);

        // Get completed shipments and revenue
        const { data: completedShipments } = await supabase
          .from('shipments')
          .select('price')
          .eq('status', 'delivered');

        const completedCount = completedShipments?.length || 0;
        const totalRevenue = completedShipments?.reduce((sum, shipment) => sum + (shipment.price || 0), 0) || 0;

        setStats({
          totalBusinesses: businessCount || 0,
          totalTruckers: truckerCount || 0,
          activeShipments: activeCount || 0,
          completedShipments: completedCount,
          totalRevenue
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Total Businesses</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.totalBusinesses}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Total Truckers</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.totalTruckers}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Active Shipments</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.activeShipments}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Completed Shipments</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.completedShipments}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.totalRevenue.toLocaleString()} RWF</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {/* Add recent activity items here */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;