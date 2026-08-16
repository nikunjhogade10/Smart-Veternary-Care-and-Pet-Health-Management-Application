import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import MobileContainer from '../components/MobileContainer';
import BottomNav from '../components/BottomNav';
import PetoButton from '../components/PetoButton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import {
  Heart,
  CreditCard,
  Crown,
  Calendar,
  ShoppingBag,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Phone,
  Info,
  ArrowLeft,
} from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { clearSession, getStoredUser, type StoredUser } from '../../lib/session';

const DEFAULT_AVATAR =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect fill="%23059669" width="128" height="128" rx="24"/><text x="64" y="80" text-anchor="middle" font-size="40" fill="white">👤</text></svg>`
  );

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<StoredUser | null>(() => getStoredUser());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await apiFetch('/auth/me');
      if (!res.ok) return;
      const me = await res.json();
      if (cancelled) return;
      setUser({
        id: me.id,
        phone: me.phone,
        full_name: me.full_name,
        email: me.email,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayName = user?.full_name?.trim() || 'Pet parent';
  const phoneDisplay = user?.phone ? `+91 ${user.phone}` : '';
  const isPremium = false;

  const menuSections = [
    {
      title: 'Pet Management',
      items: [
        {
          icon: Heart,
          label: 'Manage Pets',
          description: 'View and edit your pet profiles',
          color: '#059669',
          path: '/pets',
        },
      ],
    },
    {
      title: 'Account & Billing',
      items: [
        {
          icon: CreditCard,
          label: 'Payment Methods',
          description: 'Manage your saved cards and UPI',
          color: '#0B1220',
          path: '/payment-methods',
        },
        {
          icon: Crown,
          label: 'Subscription Status',
          description: isPremium ? 'Premium Member' : 'Free Plan',
          color: '#C9A227',
          path: '/premium',
          badge: isPremium ? 'Active' : null,
        },
      ],
    },
    {
      title: 'History',
      items: [
        {
          icon: Calendar,
          label: 'Appointment History',
          description: 'View past and upcoming consultations',
          color: '#059669',
          path: '/appointment-history',
        },
        {
          icon: ShoppingBag,
          label: 'Order History',
          description: 'Track your orders and purchases',
          color: '#0B1220',
          path: '/order-history',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: Settings,
          label: 'Settings',
          description: 'App preferences and notifications',
          color: '#6B7280',
          path: '/settings',
        },
        {
          icon: HelpCircle,
          label: 'Help & Support',
          description: 'FAQs, contact us, feedback',
          color: '#6B7280',
          path: '/help-support',
        },
        {
          icon: Info,
          label: 'About Pashvik',
          description: 'App info, version, and legal',
          color: '#6B7280',
          path: '/about',
        },
      ],
    },
  ];

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      clearSession();
      navigate('/login', { replace: true });
    }
  };

  return (
    <MobileContainer>
      <div className="h-full bg-[#F8F7F3] overflow-y-auto pb-20">
        <div className="bg-gradient-to-r from-[#0B1220] to-[#059669] px-6 pt-12 relative pb-8 rounded-b-[30px]">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-white/80 hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-2xl mb-6" style={{ fontWeight: 700 }}>
            Profile
          </h1>

          <div className="bg-white/10 backdrop-blur-lg rounded-[20px] p-4 border border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/20">
                <ImageWithFallback
                  src={DEFAULT_AVATAR}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-white text-lg mb-1" style={{ fontWeight: 700 }}>
                  {displayName}
                </h2>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{phoneDisplay || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3
                className="text-[#6B7280] text-xs uppercase tracking-wide mb-3 px-2"
                style={{ fontWeight: 600 }}
              >
                {section.title}
              </h3>
              <div className="bg-white rounded-[20px] overflow-hidden shadow-sm">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={itemIndex}
                      onClick={() => item.path && navigate(item.path)}
                      className={`w-full flex items-center gap-4 p-4 hover:bg-[#F3F4F6] transition-colors ${
                        itemIndex !== section.items.length - 1 ? 'border-b border-[#E5E7EB]' : ''
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${item.color}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: item.color }} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-[#111827] text-base" style={{ fontWeight: 600 }}>
                            {item.label}
                          </p>
                          {item.badge && (
                            <span
                              className="text-xs px-2 py-0.5 bg-[#059669]/10 text-[#059669] rounded-full"
                              style={{ fontWeight: 600 }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[#6B7280] text-xs">{item.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="bg-white rounded-[20px] overflow-hidden shadow-sm">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-4 hover:bg-red-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-red-600 text-base" style={{ fontWeight: 600 }}>
                  Logout
                </p>
                <p className="text-[#6B7280] text-xs">Sign out of your account</p>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400" />
            </button>
          </div>

          <div className="text-center py-4">
            <p className="text-[#9CA3AF] text-xs">Pashvik Version 1.0.0</p>
            <p className="text-[#9CA3AF] text-xs mt-1">© 2026 Pashvik. All rights reserved.</p>
          </div>
        </div>
      </div>
      <BottomNav />
      <PetoButton />
    </MobileContainer>
  );
}
