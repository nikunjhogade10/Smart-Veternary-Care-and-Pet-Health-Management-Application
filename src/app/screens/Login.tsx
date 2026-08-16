import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import MobileContainer from '../components/MobileContainer';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { apiFetch } from '../../lib/api';
import { setStoredSession } from '../../lib/session';

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setError('');
    if (!showOtp) {
      if (phone.replace(/\D/g, '').length < 10) {
        setError('Enter a valid 10-digit mobile number');
        return;
      }
      setLoading(true);
      try {
        const digits = phone.replace(/\D/g, '').slice(-10);
        const res = await apiFetch('/auth/send-otp', {
          method: 'POST',
          body: JSON.stringify({ phone: digits }),
        });
        if (!res.ok) throw new Error('Failed to send OTP');
        setShowOtp(true);
      } catch {
        setError('Could not send OTP. Is the backend running?');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (otp.trim().length < 6) {
      setError('Enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      const digits = phone.replace(/\D/g, '').slice(-10);
      const res = await apiFetch('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone: digits, otp: otp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || 'Invalid OTP');
        return;
      }
      setStoredSession(data.access_token, data.user);
      const pr = await apiFetch('/pets');
      const pj = await pr.json();
      const n = Array.isArray(pj.pets) ? pj.pets.length : 0;
      navigate(n === 0 ? '/add-pet' : '/dashboard', { replace: true });
    } catch {
      setError('Sign-in failed. Check the backend and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileContainer>
      <div className="h-full relative">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1642975967602-653d378f3b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXRlcmluYXJpYW4lMjBkb2N0b3IlMjBwcm9mZXNzaW9uYWwlMjB3aGl0ZSUyMGNvYXR8ZW58MXx8fHwxNzczODQ0ODI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Veterinarian"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220]/60 via-[#0B1220]/40 to-[#0B1220]/80"></div>
        </div>

        <div className="relative h-full flex flex-col justify-end p-6 pb-12">
          <div className="mb-8">
            <h2 className="text-white text-3xl mb-2" style={{ fontWeight: 700 }}>
              Welcome to
            </h2>
            <h1 className="text-white text-4xl mb-3" style={{ fontWeight: 700 }}>
              Pashvik
            </h1>
            <p className="text-white/90 text-base">
              Premium veterinary care for your beloved pets
            </p>
          </div>

          <div className="bg-white rounded-[20px] p-6 shadow-2xl">
            {!showOtp ? (
              <>
                <h3 className="text-[#111827] text-xl mb-4" style={{ fontWeight: 600 }}>
                  Sign in to continue
                </h3>
                <div className="mb-4">
                  <label className="text-[#6B7280] text-sm mb-2 block">Phone Number</label>
                  <div className="flex items-center gap-2">
                    <span className="text-[#111827] text-base px-3 py-3 bg-[#F3F4F6] rounded-xl">+91</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="flex-1 px-4 py-3 bg-[#F3F4F6] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                      maxLength={10}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-[#111827] text-xl mb-4" style={{ fontWeight: 600 }}>
                  Enter OTP
                </h3>
                <p className="text-[#6B7280] text-sm mb-4">
                  Code sent to +91 {phone.replace(/\D/g, '').slice(-10)}
                </p>
                <p className="text-[#059669] text-xs mb-2" style={{ fontWeight: 600 }}>
                  Dev mode: use OTP 123456
                </p>
                <div className="mb-4">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-3 bg-[#F3F4F6] rounded-xl text-[#111827] text-center text-2xl tracking-widest placeholder:text-[#9CA3AF] placeholder:text-base placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-[#059669]"
                    maxLength={6}
                  />
                </div>
              </>
            )}

            {error ? <p className="text-red-600 text-sm mb-2">{error}</p> : null}

            <button
              onClick={handleContinue}
              disabled={loading}
              className="w-full mt-6 bg-[#059669] text-white py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#047857] transition-colors shadow-lg disabled:opacity-60"
              style={{ fontWeight: 600 }}
            >
              {loading ? 'Please wait…' : 'Continue'}
              {!loading ? <ArrowRight className="w-5 h-5" /> : null}
            </button>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
}
