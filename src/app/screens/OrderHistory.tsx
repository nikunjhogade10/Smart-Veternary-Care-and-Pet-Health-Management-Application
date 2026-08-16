import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import MobileContainer from '../components/MobileContainer';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { getStoredToken } from '../../lib/session';

type OrderType = {
  id: string;
  items: { name: string; quantity: number; image?: string }[];
  totalAmount: number;
  orderDate: string;
  estimatedDelivery?: string;
  deliveredDate?: string;
  status: string;
  trackingNumber?: string;
};

export default function OrderHistory() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [allOrders, setAllOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getStoredToken()) {
      navigate('/login', { replace: true });
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await apiFetch('/shop/orders');
      const data = await res.json();
      if (!cancelled && res.ok && Array.isArray(data.orders)) {
        setAllOrders(data.orders);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const { activeOrders, completedOrders } = useMemo(() => {
    const active = allOrders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');
    const completed = allOrders.filter((o) => o.status === 'delivered' || o.status === 'completed');
    return { activeOrders: active, completedOrders: completed };
  }, [allOrders]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'shipped':
        return <Truck className="w-5 h-5" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      case 'processing':
        return <Clock className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shipped':
        return { bg: '#059669', text: '#059669' };
      case 'delivered':
        return { bg: '#10B981', text: '#10B981' };
      case 'processing':
        return { bg: '#F59E0B', text: '#F59E0B' };
      default:
        return { bg: '#6B7280', text: '#6B7280' };
    }
  };

  const orders = activeTab === 'active' ? activeOrders : completedOrders;

  return (
    <MobileContainer>
      <div className="h-full bg-[#F8F7F3] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B1220] to-[#059669] px-6 pt-12 pb-6 rounded-b-[30px] relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-12 left-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          <h1 className="text-white text-2xl mb-4" style={{ fontWeight: 700 }}>
            Order History
          </h1>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                activeTab === 'active'
                  ? 'bg-white text-[#059669]'
                  : 'bg-white/10 text-white/80'
              }`}
              style={{ fontWeight: 600 }}
            >
              Active Orders
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                activeTab === 'completed'
                  ? 'bg-white text-[#059669]'
                  : 'bg-white/10 text-white/80'
              }`}
              style={{ fontWeight: 600 }}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="px-6 py-6 space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-[20px] p-8 text-center">
              <Package className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
              <p className="text-[#6B7280] text-base">
                No {activeTab} orders
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const statusColor = getStatusColor(order.status);
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-[20px] p-4 shadow-sm"
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E5E7EB]">
                    <div>
                      <p className="text-[#111827] text-base mb-1" style={{ fontWeight: 700 }}>
                        {order.id}
                      </p>
                      <p className="text-[#6B7280] text-xs">
                        Ordered on {order.orderDate}
                      </p>
                    </div>
                    <div
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: `${statusColor.bg}15` }}
                    >
                      <div style={{ color: statusColor.text }}>
                        {getStatusIcon(order.status)}
                      </div>
                      <span className="text-xs capitalize" style={{ color: statusColor.text, fontWeight: 600 }}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F3F4F6]">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-[#111827] text-sm mb-1" style={{ fontWeight: 600 }}>
                            {item.name}
                          </p>
                          <p className="text-[#6B7280] text-xs">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="bg-[#F3F4F6] rounded-xl p-3 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#6B7280] text-sm">Total Amount</span>
                      <span className="text-[#111827] text-base" style={{ fontWeight: 700 }}>
                        ₹{order.totalAmount}
                      </span>
                    </div>
                    {order.status === 'shipped' && order.estimatedDelivery && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#6B7280] text-xs">Estimated Delivery</span>
                        <span className="text-[#059669] text-xs" style={{ fontWeight: 600 }}>
                          {order.estimatedDelivery}
                        </span>
                      </div>
                    )}
                    {order.status === 'delivered' && order.deliveredDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#6B7280] text-xs">Delivered on</span>
                        <span className="text-[#10B981] text-xs" style={{ fontWeight: 600 }}>
                          {order.deliveredDate}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    {order.status === 'shipped' ? (
                      <>
                        <button
                          onClick={() => alert(`Track order: ${order.trackingNumber}`)}
                          className="py-2.5 bg-[#059669] text-white rounded-xl hover:bg-[#047857] transition-colors"
                          style={{ fontWeight: 600, fontSize: '14px' }}
                        >
                          Track Order
                        </button>
                        <button
                          onClick={() => alert('View details')}
                          className="py-2.5 bg-white border border-[#E5E7EB] text-[#111827] rounded-xl hover:bg-[#F3F4F6] transition-colors"
                          style={{ fontWeight: 600, fontSize: '14px' }}
                        >
                          View Details
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => navigate('/shop')}
                          className="py-2.5 bg-[#059669] text-white rounded-xl hover:bg-[#047857] transition-colors"
                          style={{ fontWeight: 600, fontSize: '14px' }}
                        >
                          Reorder
                        </button>
                        <button
                          onClick={() => alert('View invoice')}
                          className="py-2.5 bg-white border border-[#E5E7EB] text-[#111827] rounded-xl hover:bg-[#F3F4F6] transition-colors"
                          style={{ fontWeight: 600, fontSize: '14px' }}
                        >
                          Invoice
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </MobileContainer>
  );
}
