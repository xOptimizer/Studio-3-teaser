import { useEffect, useState } from 'react';
import { adminFetchOrders } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = ({ onNavigate }) => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== 'admin') {
      onNavigate('/');
      return;
    }

    adminFetchOrders()
      .then((data) => setOrders(data.orders || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user, authLoading, onNavigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-[120px] px-4 flex items-center justify-center">
        <p className="text-gray-500">Loading admin dashboard...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen pt-[120px] pb-24 px-4 sm:px-6" style={{ background: '#F7F7F7' }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-black">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">Orders and ticket verification</p>
          </div>
          <button
            onClick={() => onNavigate('/admin/scanner')}
            className="px-5 py-2.5 rounded-full bg-orange-600 text-white text-sm font-bold"
          >
            Open QR Scanner
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 text-red-600 text-sm">{error}</div>
        )}

        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500 uppercase text-xs">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Buyer</th>
                <th className="p-4">Event</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-gray-100">
                  <td className="p-4 text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-black">{order.user?.name}</div>
                    <div className="text-gray-500 text-xs">{order.buyerEmail}</div>
                  </td>
                  <td className="p-4">{order.event?.title}</td>
                  <td className="p-4">{order.quantity}</td>
                  <td className="p-4">${(order.amountCents / 100).toFixed(2)}</td>
                  <td className="p-4 font-semibold">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <p className="p-8 text-center text-gray-500">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
