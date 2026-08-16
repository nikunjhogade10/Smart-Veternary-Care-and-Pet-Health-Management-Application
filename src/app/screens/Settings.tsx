import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import MobileContainer from '../components/MobileContainer';
import { ArrowLeft, Bell, Lock, Globe, Moon, Smartphone, Volume2, Eye, ChevronRight } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settingsSections = [
    {
      title: 'Notifications',
      items: [
        {
          icon: Bell,
          label: 'Push Notifications',
          description: 'Receive alerts for appointments and reminders',
          type: 'toggle',
          value: notifications,
          onChange: setNotifications,
        },
        {
          icon: Volume2,
          label: 'Sound',
          description: 'Enable notification sounds',
          type: 'toggle',
          value: soundEnabled,
          onChange: setSoundEnabled,
        },
      ],
    },
    {
      title: 'Appearance',
      items: [
        {
          icon: Moon,
          label: 'Dark Mode',
          description: 'Switch to dark theme',
          type: 'toggle',
          value: darkMode,
          onChange: setDarkMode,
        },
        {
          icon: Globe,
          label: 'Language',
          description: 'English',
          type: 'link',
          onClick: () => alert('Language selection coming soon'),
        },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          icon: Lock,
          label: 'Change Password',
          description: 'Update your account password',
          type: 'link',
          onClick: () => alert('Change password'),
        },
        {
          icon: Eye,
          label: 'Privacy Settings',
          description: 'Control your data and visibility',
          type: 'link',
          onClick: () => alert('Privacy settings'),
        },
        {
          icon: Smartphone,
          label: 'Biometric Login',
          description: 'Use fingerprint or face ID',
          type: 'link',
          onClick: () => alert('Biometric login'),
        },
      ],
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
            Settings
          </h1>
        </div>

        {/* Settings Sections */}
        <div className="px-6 py-6 space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-[#6B7280] text-xs uppercase tracking-wide mb-3 px-2" style={{ fontWeight: 600 }}>
                {section.title}
              </h3>
              <div className="bg-white rounded-[20px] overflow-hidden shadow-sm">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={itemIndex}
                      className={`flex items-center gap-4 p-4 ${
                        itemIndex !== section.items.length - 1 ? 'border-b border-[#E5E7EB]' : ''
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#059669]/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#059669]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[#111827] text-base mb-1" style={{ fontWeight: 600 }}>
                          {item.label}
                        </p>
                        <p className="text-[#6B7280] text-xs">
                          {item.description}
                        </p>
                      </div>
                      {item.type === 'toggle' ? (
                        <button
                          onClick={() => item.onChange?.(!item.value)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            item.value ? 'bg-[#059669]' : 'bg-[#E5E7EB]'
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                              item.value ? 'translate-x-6' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      ) : (
                        <button onClick={item.onClick}>
                          <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Clear Cache */}
          <div className="bg-white rounded-[20px] p-5 shadow-sm">
            <button
              onClick={() => {
                if (confirm('Clear all cached data?')) {
                  alert('Cache cleared successfully!');
                }
              }}
              className="w-full text-center"
            >
              <p className="text-red-600 text-base mb-1" style={{ fontWeight: 600 }}>
                Clear Cache
              </p>
              <p className="text-[#6B7280] text-xs">
                Free up storage space
              </p>
            </button>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
}
