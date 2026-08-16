import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import MobileContainer from '../components/MobileContainer';
import { Heart, Plus } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { clearSession, getStoredToken } from '../../lib/session';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const go = async () => {
      const token = getStoredToken();
      if (token) {
        try {
          const me = await apiFetch('/auth/me');
          if (!me.ok) throw new Error('session');
          const pr = await apiFetch('/pets');
          const pj = await pr.json();
          if (cancelled) return;
          if (!pr.ok) throw new Error('pets');
          const n = Array.isArray(pj.pets) ? pj.pets.length : 0;
          navigate(n === 0 ? '/add-pet' : '/dashboard', { replace: true });
          return;
        } catch {
          clearSession();
        }
      }
      timer = setTimeout(() => {
        if (!cancelled) navigate('/login', { replace: true });
      }, 2500);
    };

    go();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <MobileContainer>
      <div className="h-full bg-gradient-to-br from-[#0B1220] via-[#0B1220] to-[#059669] flex flex-col items-center justify-center p-8">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#059669]/10 to-[#C9A227]/10"></div>
            <div className="relative">
              <Heart className="w-10 h-10 text-[#059669]" fill="#059669" strokeWidth={2} />
              <Plus
                className="absolute -top-1 -right-1 w-6 h-6 text-[#C9A227]"
                strokeWidth={3}
              />
            </div>
          </div>
        </div>

        <h1
          className="text-white text-5xl mb-3"
          style={{ fontWeight: 700, letterSpacing: '-0.02em' }}
        >
          Pashvik
        </h1>

        <p
          className="text-white/80 text-center text-base max-w-xs"
          style={{ fontWeight: 400, lineHeight: 1.6 }}
        >
          Premium Veterinary Care
          <br />
          At Your Fingertips
        </p>

        <div className="mt-12 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-white/60 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
    </MobileContainer>
  );
}
