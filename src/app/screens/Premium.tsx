import React from 'react';
import { useNavigate } from 'react-router';
import MobileContainer from '../components/MobileContainer';
import { ArrowLeft, Crown, Check, Zap, Star, Shield, Gift } from 'lucide-react';

export default function Premium() {
  const navigate = useNavigate();

  const benefits = [
    { icon: Zap, text: 'Priority consultation booking' },
    { icon: Star, text: 'Unlimited AI chatbot assistance' },
    { icon: Shield, text: '24/7 emergency vet support' },
    { icon: Gift, text: '20% discount on all shop products' },
    { icon: Check, text: 'Free home delivery on medicines' },
    { icon: Check, text: 'Access to exclusive webinars' },
  ];

  const plans = [
    { duration: 'Monthly', price: 499, savings: null },
    { duration: 'Quarterly', price: 1299, savings: '₹200', popular: true },
    { duration: 'Yearly', price: 4999, savings: '₹1000' },
  ];

  return (
    <MobileContainer>
      <div className="h-full bg-gradient-to-b from-[#0B1220] via-[#0B1220] to-[#059669] overflow-y-auto">
        {/* Header */}
        <div className="px-6 pt-12 pb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-6"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          {/* Premium Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#C9A227] to-[#967919] rounded-3xl flex items-center justify-center shadow-2xl">
              <Crown className="w-10 h-10 text-white" fill="white" />
            </div>
          </div>

          <h1 className="text-white text-3xl text-center mb-3" style={{ fontWeight: 700 }}>
            Pashvik Premium
          </h1>
          <p className="text-white/80 text-center text-base">
            Elevate your pet care experience
          </p>
        </div>

        {/* Benefits */}
        <div className="px-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-[24px] p-6 border border-white/20">
            <h2 className="text-white text-xl mb-4" style={{ fontWeight: 700 }}>
              Premium Benefits
            </h2>
            <div className="space-y-3">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#C9A227]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#C9A227]" strokeWidth={2.5} />
                    </div>
                    <span className="text-white text-sm">{benefit.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="px-6 pb-8">
          <h2 className="text-white text-xl mb-4" style={{ fontWeight: 700 }}>
            Choose Your Plan
          </h2>
          <div className="space-y-3">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`relative rounded-[20px] p-5 border-2 transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-br from-[#C9A227]/20 to-[#C9A227]/5 border-[#C9A227]'
                    : 'bg-white/5 border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-[#C9A227] text-white text-xs rounded-full" style={{ fontWeight: 700 }}>
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-white text-lg mb-1" style={{ fontWeight: 700 }}>
                      {plan.duration}
                    </h3>
                    {plan.savings && (
                      <p className="text-[#C9A227] text-xs" style={{ fontWeight: 600 }}>
                        Save {plan.savings}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-white text-2xl" style={{ fontWeight: 700 }}>
                      ₹{plan.price}
                    </p>
                    <p className="text-white/60 text-xs">
                      {plan.duration === 'Monthly' ? '/month' : 'total'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => alert('Premium subscription activated!')}
                  className={`w-full py-3 rounded-xl transition-colors ${
                    plan.popular
                      ? 'bg-[#C9A227] hover:bg-[#967919] text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/30'
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  Upgrade Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-6 pb-8">
          <p className="text-white/60 text-xs text-center">
            Cancel anytime. No hidden fees. Money-back guarantee within 7 days.
          </p>
        </div>
      </div>
    </MobileContainer>
  );
}
