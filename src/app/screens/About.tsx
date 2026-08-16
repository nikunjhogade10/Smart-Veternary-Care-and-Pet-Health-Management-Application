import React from 'react';
import { useNavigate } from 'react-router';
import MobileContainer from '../components/MobileContainer';
import { ArrowLeft, Shield, Mail, Globe, FileText, Heart } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  const aboutSections = [
    {
      title: 'About Pashvik',
      content: 'Pashvik is a premium ultra-luxury mobile veterinary care platform that combines telemedicine, pet health tracking, e-commerce, and AI assistance into one seamless experience. We provide world-class veterinary services at your fingertips, ensuring your pets receive the best care possible.',
    },
    {
      title: 'Our Mission',
      content: 'To revolutionize pet healthcare by making premium veterinary services accessible, convenient, and comprehensive for every pet parent.',
    },
    {
      title: 'Features',
      content: '• Video & Chat Consultations with certified vets\n• Home Visit Services\n• 24/7 Emergency Consultations\n• AI-powered Pet Health Assistant (Peto)\n• Complete Health Records Management\n• Premium Pet Products E-commerce\n• Daily Health Tracking & Reminders\n• Nearby Veterinary Clinic Finder',
    },
  ];

  const legalLinks = [
    { icon: FileText, label: 'Terms of Service', url: '#' },
    { icon: Shield, label: 'Privacy Policy', url: '#' },
    { icon: FileText, label: 'Refund Policy', url: '#' },
  ];

  const contactInfo = [
    { icon: Mail, label: 'support@pashvik.com', type: 'email' },
    { icon: Globe, label: 'www.pashvik.com', type: 'website' },
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
          
          <div className="text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-lg rounded-[20px] flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-white" fill="white" />
            </div>
            <h1 className="text-white text-2xl mb-2" style={{ fontWeight: 700 }}>
              Pashvik
            </h1>
            <p className="text-white/80 text-sm">
              Premium Veterinary Care Platform
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Version Info */}
          <div className="bg-white rounded-[20px] p-5 shadow-sm text-center">
            <p className="text-[#6B7280] text-sm mb-1">Version</p>
            <p className="text-[#111827] text-2xl" style={{ fontWeight: 700 }}>
              1.0.0
            </p>
            <p className="text-[#6B7280] text-xs mt-2">
              Released: March 2026
            </p>
          </div>

          {/* About Sections */}
          {aboutSections.map((section, index) => (
            <div key={index} className="bg-white rounded-[20px] p-5 shadow-sm">
              <h2 className="text-[#111827] text-lg mb-3" style={{ fontWeight: 700 }}>
                {section.title}
              </h2>
              <p className="text-[#6B7280] text-sm leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </div>
          ))}

          {/* Contact Information */}
          <div className="bg-white rounded-[20px] p-5 shadow-sm">
            <h2 className="text-[#111827] text-lg mb-4" style={{ fontWeight: 700 }}>
              Contact Us
            </h2>
            <div className="space-y-3">
              {contactInfo.map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <a
                    key={index}
                    href={contact.type === 'email' ? `mailto:${contact.label}` : `https://${contact.label}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#059669]/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#059669]" />
                    </div>
                    <span className="text-[#111827] text-sm" style={{ fontWeight: 500 }}>
                      {contact.label}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Legal Links */}
          <div className="bg-white rounded-[20px] p-5 shadow-sm">
            <h2 className="text-[#111827] text-lg mb-4" style={{ fontWeight: 700 }}>
              Legal
            </h2>
            <div className="space-y-2">
              {legalLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <button
                    key={index}
                    onClick={() => alert('This would open: ' + link.label)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#F3F4F6] transition-colors"
                  >
                    <Icon className="w-5 h-5 text-[#6B7280]" />
                    <span className="text-[#111827] text-sm" style={{ fontWeight: 500 }}>
                      {link.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Credits */}
          <div className="bg-gradient-to-r from-[#0B1220] to-[#059669] rounded-[20px] p-5 text-center">
            <p className="text-white/90 text-sm mb-2">
              Made with love for pet parents worldwide
            </p>
            <div className="flex items-center justify-center gap-2 text-white">
              <Heart className="w-4 h-4" fill="white" />
              <span className="text-xs">Caring for your furry friends since 2026</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center pb-6">
            <p className="text-[#9CA3AF] text-xs">
              © 2026 Pashvik Technologies Pvt. Ltd.
            </p>
            <p className="text-[#9CA3AF] text-xs mt-1">
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
}
