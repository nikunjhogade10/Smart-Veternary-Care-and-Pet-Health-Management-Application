import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import MobileContainer from '../components/MobileContainer';
import { ArrowLeft, MessageCircle, Phone, Mail, HelpCircle, ChevronDown, ChevronRight, Send } from 'lucide-react';

export default function HelpSupport() {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');

  const faqs = [
    {
      question: 'How do I book a consultation?',
      answer: 'Go to the Consultation tab, select a veterinarian, choose your preferred consultation type (Video, Chat, Home Visit, or Emergency), and select a time slot. Confirm your booking and you\'re all set!',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept credit/debit cards (Visa, Mastercard, RuPay), UPI payments, net banking, and digital wallets. You can save your preferred payment method in the Payment Methods section.',
    },
    {
      question: 'Can I cancel or reschedule an appointment?',
      answer: 'Yes, you can cancel or reschedule appointments up to 2 hours before the scheduled time. Go to Appointment History, select the appointment, and choose the reschedule option.',
    },
    {
      question: 'How does the AI assistant Peto work?',
      answer: 'Peto is our AI-powered pet health assistant. Click the floating Peto button to ask questions about pet care, symptoms, nutrition, or general advice. For medical concerns, we recommend consulting with a licensed veterinarian.',
    },
    {
      question: 'What are the benefits of Premium membership?',
      answer: 'Premium members get unlimited consultations, priority booking, 24/7 emergency support, exclusive discounts on products, free home visits (limited), and access to premium features.',
    },
    {
      question: 'How do I track my orders?',
      answer: 'Go to Order History from your profile. Active orders will show tracking information. Click "Track Order" to see real-time delivery status.',
    },
  ];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team',
      color: '#059669',
      action: () => alert('Opening live chat...'),
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: '+91 1800-PASHVIK',
      color: '#0B1220',
      action: () => alert('Calling support...'),
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'support@pashvik.com',
      color: '#6B7280',
      action: () => window.open('mailto:support@pashvik.com'),
    },
  ];

  const handleSubmitFeedback = () => {
    if (feedback.trim()) {
      alert('Thank you for your feedback! We appreciate your input.');
      setFeedback('');
    } else {
      alert('Please enter your feedback before submitting.');
    }
  };

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
            Help & Support
          </h1>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Contact Options */}
          <div>
            <h3 className="text-[#6B7280] text-xs uppercase tracking-wide mb-3 px-2" style={{ fontWeight: 600 }}>
              Contact Us
            </h3>
            <div className="space-y-3">
              {contactOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <button
                    key={index}
                    onClick={option.action}
                    className="w-full bg-white rounded-[20px] p-4 shadow-sm flex items-center gap-4 hover:bg-[#F3F4F6] transition-colors"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${option.color}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: option.color }} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-[#111827] text-base mb-1" style={{ fontWeight: 600 }}>
                        {option.title}
                      </p>
                      <p className="text-[#6B7280] text-sm">
                        {option.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* FAQs */}
          <div>
            <h3 className="text-[#6B7280] text-xs uppercase tracking-wide mb-3 px-2" style={{ fontWeight: 600 }}>
              Frequently Asked Questions
            </h3>
            <div className="bg-white rounded-[20px] overflow-hidden shadow-sm">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`${
                    index !== faqs.length - 1 ? 'border-b border-[#E5E7EB]' : ''
                  }`}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-4 flex items-start gap-3 hover:bg-[#F3F4F6] transition-colors"
                  >
                    <HelpCircle className="w-5 h-5 text-[#059669] flex-shrink-0 mt-0.5" />
                    <div className="flex-1 text-left">
                      <p className="text-[#111827] text-base" style={{ fontWeight: 600 }}>
                        {faq.question}
                      </p>
                      {expandedFaq === index && (
                        <p className="text-[#6B7280] text-sm mt-2 leading-relaxed">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[#9CA3AF] flex-shrink-0 transition-transform ${
                        expandedFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Form */}
          <div>
            <h3 className="text-[#6B7280] text-xs uppercase tracking-wide mb-3 px-2" style={{ fontWeight: 600 }}>
              Send Us Feedback
            </h3>
            <div className="bg-white rounded-[20px] p-5 shadow-sm">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts, suggestions, or report an issue..."
                className="w-full h-32 px-4 py-3 bg-[#F3F4F6] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#059669] resize-none"
              />
              <button
                onClick={handleSubmitFeedback}
                className="w-full mt-3 py-3 bg-[#059669] text-white rounded-xl hover:bg-[#047857] transition-colors flex items-center justify-center gap-2"
                style={{ fontWeight: 600 }}
              >
                <Send className="w-4 h-4" />
                Submit Feedback
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-[20px] p-5 shadow-sm">
            <h3 className="text-[#111827] text-base mb-3" style={{ fontWeight: 600 }}>
              Quick Links
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => alert('Opening tutorial...')}
                className="w-full text-left text-[#059669] text-sm py-2 hover:underline"
              >
                → How to use Pashvik
              </button>
              <button
                onClick={() => alert('Opening community guidelines...')}
                className="w-full text-left text-[#059669] text-sm py-2 hover:underline"
              >
                → Community Guidelines
              </button>
              <button
                onClick={() => navigate('/about')}
                className="w-full text-left text-[#059669] text-sm py-2 hover:underline"
              >
                → About Pashvik
              </button>
            </div>
          </div>

          {/* Support Hours */}
          <div className="bg-[#059669]/10 rounded-[20px] p-4 border border-[#059669]/20 text-center">
            <p className="text-[#059669] text-sm" style={{ fontWeight: 600 }}>
              📞 Support Available 24/7
            </p>
            <p className="text-[#6B7280] text-xs mt-1">
              We're here to help anytime you need us
            </p>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
}
