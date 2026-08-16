import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import MobileContainer from '../components/MobileContainer';
import { ArrowLeft, CreditCard, Smartphone, Plus, Trash2, CheckCircle } from 'lucide-react';

export default function PaymentMethods() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('card1');

  const paymentMethods = [
    {
      id: 'card1',
      type: 'card',
      name: 'Visa •••• 4242',
      expiry: '12/26',
      default: true,
    },
    {
      id: 'card2',
      type: 'card',
      name: 'Mastercard •••• 8888',
      expiry: '09/25',
      default: false,
    },
    {
      id: 'upi1',
      type: 'upi',
      name: 'alex@paytm',
      default: false,
    },
  ];

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
          
          <h1 className="text-white text-2xl" style={{ fontWeight: 700 }}>
            Payment Methods
          </h1>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          {/* Saved Payment Methods */}
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`bg-white rounded-[20px] p-4 shadow-sm border-2 transition-all ${
                selectedMethod === method.id ? 'border-[#059669]' : 'border-transparent'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
                  {method.type === 'card' ? (
                    <CreditCard className="w-6 h-6 text-[#0B1220]" />
                  ) : (
                    <Smartphone className="w-6 h-6 text-[#059669]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[#111827] text-base" style={{ fontWeight: 600 }}>
                      {method.name}
                    </p>
                    {method.default && (
                      <span className="text-xs px-2 py-0.5 bg-[#059669]/10 text-[#059669] rounded-full" style={{ fontWeight: 600 }}>
                        Default
                      </span>
                    )}
                  </div>
                  {method.expiry && (
                    <p className="text-[#6B7280] text-xs">
                      Expires: {method.expiry}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedMethod === method.id
                        ? 'border-[#059669] bg-[#059669]'
                        : 'border-[#E5E7EB]'
                    }`}
                  >
                    {selectedMethod === method.id && (
                      <CheckCircle className="w-5 h-5 text-white" fill="white" />
                    )}
                  </button>
                  <button
                    onClick={() => alert('Delete payment method')}
                    className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Payment Method */}
          <button
            onClick={() => alert('Add new payment method')}
            className="w-full bg-white rounded-[20px] p-5 shadow-sm border-2 border-dashed border-[#E5E7EB] hover:border-[#059669] hover:bg-[#059669]/5 transition-all"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#059669]/10 flex items-center justify-center">
                <Plus className="w-5 h-5 text-[#059669]" />
              </div>
              <span className="text-[#059669] text-base" style={{ fontWeight: 600 }}>
                Add New Payment Method
              </span>
            </div>
          </button>

          {/* Info Card */}
          <div className="bg-[#059669]/10 rounded-[20px] p-4 border border-[#059669]/20">
            <p className="text-[#059669] text-sm leading-relaxed">
              💳 Your payment information is securely encrypted and stored. We never share your details with third parties.
            </p>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
}
