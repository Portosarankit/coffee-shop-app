import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ApiClient } from '../services/api';

export const OrderStatusPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch initial order status
    fetch(`/api/orders/${orderId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch order');
        return res.json();
      })
      .then((json) => {
        setOrder(json.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    // Socket.io connection for real-time updates
    const socket = ApiClient.getSocket();
    socket.emit('join', `order-${orderId}`);

    socket.on('order:updated', (updatedOrder: any) => {
      if (updatedOrder.id === Number(orderId)) {
        setOrder(updatedOrder);
      }
    });

    return () => {
      socket.off('order:updated');
    };
  }, [orderId]);

  if (loading) return <div className="text-center py-20">Loading order status...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;
  if (!order) return <div className="text-center py-20">Order not found</div>;

  const statuses = ['RECEIVED', 'PREPARING', 'READY', 'SERVED'];
  const currentIndex = statuses.indexOf(order.status);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center border-b pb-6 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
            <p className="text-sm text-gray-500 mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-amber-100 text-amber-800">
            {order.status}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {statuses.map((status, idx) => (
              <span
                key={status}
                className={`text-xs font-bold ${idx <= currentIndex ? 'text-amber-800' : 'text-gray-400'}`}
              >
                {status}
              </span>
            ))}
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-800 h-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / statuses.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Order Details */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="font-bold text-gray-800">Order Items</h3>
          {order.items?.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <div>
                <span className="font-medium text-gray-950">{item.quantity}x {item.item.nameEn}</span>
                {item.selectedOptions?.length > 0 && (
                  <div className="text-xs text-gray-500">
                    {item.selectedOptions.map((opt: any, idx: number) => (
                      <span key={idx}>• {opt.choice.nameEn}</span>
                    ))}
                  </div>
                )}
              </div>
              <span className="font-semibold text-gray-900">฿{(item.unitPrice * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-6 mt-6 flex justify-between items-center text-lg font-bold">
          <span>Total</span>
          <span className="text-amber-800">฿{order.totalAmount.toFixed(2)}</span>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-block bg-amber-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-900 transition shadow"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
};
