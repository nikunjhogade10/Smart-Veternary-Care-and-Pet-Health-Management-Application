import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Home, Heart, Stethoscope, ShoppingBag, User, Users } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/community', icon: Users, label: 'Community' },
    { path: '/pets', icon: Heart, label: 'Pets' },
    { path: '/consultation', icon: Stethoscope, label: 'Vet' },
    { path: '/shop', icon: ShoppingBag, label: 'Shop' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-1 py-2 safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-0.5 flex-1 min-w-0 transition-all py-1"
            >
              <Icon
                className={`w-[18px] h-[18px] sm:w-5 sm:h-5 ${isActive ? 'text-[#059669]' : 'text-[#6B7280]'}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-[8px] sm:text-[9px] truncate max-w-full px-0.5 ${
                  isActive ? 'text-[#059669]' : 'text-[#6B7280]'
                }`}
                style={{ fontWeight: isActive ? 600 : 500 }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
