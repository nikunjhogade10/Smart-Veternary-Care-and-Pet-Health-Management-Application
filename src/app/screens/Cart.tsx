import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import MobileContainer from '../components/MobileContainer';
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import { cartItemCount, getCartLines, setCartLines, type CartLine } from '../../lib/cartStore';
import { apiFetch } from '../../lib/api';

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartLine[]>([]);
  const [paymentDoneOpen, setPaymentDoneOpen] = useState(false);

  const sync = () => setItems(getCartLines());

  useEffect(() => {
    sync();
    const h = () => sync();
    window.addEventListener('pashvik-cart', h);
    window.addEventListener('focus', h);
    return () => {
      window.removeEventListener('pashvik-cart', h);
      window.removeEventListener('focus', h);
    };
  }, []);

  const persist = (next: CartLine[]) => {
    setCartLines(next);
    setItems(next);
  };

  const updateQuantity = (id: number, delta: number) => {
    persist(
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id: number) => {
    persist(items.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = items.length ? 50 : 0;
  const total = subtotal + delivery;

  const checkout = async () => {
    if (!items.length) return;
    try {
      await apiFetch('/shop/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          total_amount: total,
        }),
      });
    } catch {
      // fallback silent
    }
    persist([]);
    setPaymentDoneOpen(true);
  };

  return (
    <MobileContainer>
      <div className="h-full min-h-0 flex flex-col bg-[#F8F7F3] relative overflow-hidden">
        <div className="bg-gradient-to-r from-[#0B1220] to-[#059669] px-6 pt-12 pb-6 rounded-b-[30px] flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white text-2xl flex-1" style={{ fontWeight: 700 }}>
              Shopping Cart
            </h1>
            <span className="text-white/80 text-sm">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
          {items.length === 0 ? (
            <div className="bg-white rounded-[20px] p-8 text-center shadow-sm">
              <p className="text-[#6B7280] text-sm mb-2">Your cart is empty.</p>
              <p className="text-[#9CA3AF] text-xs">Add products from the shop, then tap Pay when you are ready.</p>
            </div>
          ) : null}
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-[20px] p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 bg-[#F3F4F6] rounded-xl flex-shrink-0" />

                <div className="flex-1">
                  <h3 className="text-[#111827] text-base mb-1" style={{ fontWeight: 600 }}>
                    {item.name}
                  </h3>
                  <p className="text-[#059669] text-base mb-2" style={{ fontWeight: 700 }}>
                    ₹{item.price}
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 rounded-lg bg-white flex items-center justify-center hover:bg-[#E5E7EB] transition-colors"
                      >
                        <Minus className="w-4 h-4 text-[#111827]" />
                      </button>
                      <span className="text-[#111827] text-sm w-8 text-center" style={{ fontWeight: 600 }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 rounded-lg bg-white flex items-center justify-center hover:bg-[#E5E7EB] transition-colors"
                      >
                        <Plus className="w-4 h-4 text-[#111827]" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#d4183d] text-sm flex items-center gap-1 hover:text-[#b0152f] transition-colors"
                      style={{ fontWeight: 600 }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-6 bg-white border-t border-[#E5E7EB] flex-shrink-0 safe-area-bottom">
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-[#6B7280] text-sm">Subtotal</span>
              <span className="text-[#111827] text-sm" style={{ fontWeight: 600 }}>
                ₹{subtotal}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280] text-sm">Delivery</span>
              <span className="text-[#111827] text-sm" style={{ fontWeight: 600 }}>
                ₹{delivery}
              </span>
            </div>
            <div className="h-px bg-[#E5E7EB]"></div>
            <div className="flex justify-between">
              <span className="text-[#111827] text-base" style={{ fontWeight: 700 }}>
                Total
              </span>
              <span className="text-[#059669] text-xl" style={{ fontWeight: 700 }}>
                ₹{total}
              </span>
            </div>
          </div>

          <button
            onClick={checkout}
            disabled={!items.length}
            className="w-full py-4 bg-[#059669] text-white rounded-xl hover:bg-[#047857] transition-colors shadow-lg disabled:opacity-50"
            style={{ fontWeight: 600 }}
          >
            Pay
          </button>
        </div>
      </div>

      {paymentDoneOpen ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-pay-done-title"
          >
            <h2 id="cart-pay-done-title" className="text-lg text-[#111827] text-center mb-2" style={{ fontWeight: 700 }}>
              Payment done
            </h2>
            <p className="text-sm text-[#6B7280] text-center mb-6">Your order is confirmed.</p>
            <button
              type="button"
              onClick={() => {
                setPaymentDoneOpen(false);
                navigate(-1);
              }}
              className="w-full py-3 rounded-xl bg-[#059669] text-white text-sm hover:bg-[#047857]"
              style={{ fontWeight: 600 }}
            >
              OK
            </button>
          </div>
        </div>
      ) : null}
    </MobileContainer>
  );
}
