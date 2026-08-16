import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import MobileContainer from '../components/MobileContainer';
import { ArrowLeft, ShoppingCart, Search } from 'lucide-react';

export default function Telemedicine() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  const medicines = [
    {
      name: 'Amoxicillin (500mg)',
      type: 'Antibiotic',
      dosage: '10 tablets',
      price: 299,
      description: 'For bacterial infections',
    },
    {
      name: 'Deworming Tablet',
      type: 'Dewormer',
      dosage: '1 tablet',
      price: 149,
      description: 'Quarterly deworming treatment',
    },
    {
      name: 'Anti-inflammatory Syrup',
      type: 'Pain Relief',
      dosage: '100ml',
      price: 399,
      description: 'For pain and inflammation',
    },
    {
      name: 'Vitamin Supplements',
      type: 'Supplement',
      dosage: '30 tablets',
      price: 549,
      description: 'Daily multivitamin for pets',
    },
    {
      name: 'Flea & Tick Treatment',
      type: 'Preventive',
      dosage: '3 doses',
      price: 699,
      description: 'Monthly flea and tick prevention',
    },
  ];

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <MobileContainer>
      <div className="h-full bg-[#F8F7F3] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B1220] to-[#059669] px-6 pt-12 pb-6 rounded-b-[30px]">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white text-2xl flex-1" style={{ fontWeight: 700 }}>
              Telemedicine
            </h1>
            <button
              onClick={() => navigate('/cart')}
              className="relative w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C9A227] text-white text-xs rounded-full flex items-center justify-center" style={{ fontWeight: 700 }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search medicines..."
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>

        {/* Info Card */}
        <div className="px-6 py-6">
          <div className="bg-[#059669]/10 border border-[#059669]/20 rounded-[20px] p-4 mb-6">
            <p className="text-[#059669] text-sm" style={{ fontWeight: 600 }}>
              Prescription medicines require vet approval. Our team will verify before shipping.
            </p>
          </div>

          {/* Medicines List */}
          <div className="space-y-3">
            {medicines.map((medicine, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[20px] p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-[#111827] text-base mb-1" style={{ fontWeight: 700 }}>
                      {medicine.name}
                    </h3>
                    <p className="text-[#6B7280] text-sm mb-1">
                      {medicine.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-[#059669]/10 text-[#059669] text-xs rounded-lg" style={{ fontWeight: 600 }}>
                        {medicine.type}
                      </span>
                      <span className="text-[#6B7280] text-xs">
                        {medicine.dosage}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-[#E5E7EB] my-3"></div>

                <div className="flex items-center justify-between">
                  <span className="text-[#111827] text-xl" style={{ fontWeight: 700 }}>
                    ₹{medicine.price}
                  </span>
                  <button
                    onClick={handleAddToCart}
                    className="px-5 py-2 bg-[#059669] text-white rounded-xl text-sm hover:bg-[#047857] transition-colors shadow-sm"
                    style={{ fontWeight: 600 }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileContainer>
  );
}
