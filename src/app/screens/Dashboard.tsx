import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import MobileContainer from '../components/MobileContainer';
import BottomNav from '../components/BottomNav';
import PetoButton from '../components/PetoButton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import {
  Calendar,
  FileText,
  Bell,
  MapPin,
  ShoppingBag,
  Video,
  Crown,
  User,
  Heart,
  Stethoscope,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { getStoredToken } from '../../lib/session';

type Pet = {
  id: number;
  name: string;
  animal_type: string;
  breed: string | null;
  age: number | null;
  weight: number | null;
  gender: string | null;
  vaccination_status: string | null;
  photo: string | null;
};

type Reminder = {
  id: number;
  pet_id: number;
  title: string;
  due_date: string;
  status: string;
};

const PLACEHOLDER_PET =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect fill="%23059669" width="128" height="128" rx="24"/><text x="64" y="78" text-anchor="middle" font-size="48" fill="white">🐾</text></svg>`
  );

export default function Dashboard() {
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getStoredToken()) {
      navigate('/login', { replace: true });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const [pr, rr] = await Promise.all([apiFetch('/pets'), apiFetch('/reminders')]);
        const pj = await pr.json();
        const rj = await rr.json();
        if (cancelled) return;
        if (pr.ok && Array.isArray(pj.pets)) setPets(pj.pets);
        if (rr.ok && Array.isArray(rj.reminders)) setReminders(rj.reminders);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const primary = pets[0];
  const nextReminder = reminders.find((r) => r.status === 'pending');

  const featureCards = [
    { title: 'Book Consultation', icon: Calendar, path: '/consultation', color: '#059669' },
    { title: 'Health Records', icon: FileText, path: '/records', color: '#6366F1' },
    { title: 'Reminders', icon: Bell, path: '/reminders', color: '#C9A227' },
    { title: 'Nearby Vets', icon: MapPin, path: '/nearby-vets', color: '#EC4899' },
    { title: 'Pet Shop', icon: ShoppingBag, path: '/shop', color: '#F97316' },
    { title: 'Telemedicine', icon: Video, path: '/telemedicine', color: '#6366F1' },
    { title: 'Community', icon: Heart, path: '/community', color: '#EC4899' },
  ];

  const healthTips = [
    { emoji: '🦷', tip: "Brush your pet's teeth 3x a week" },
    { emoji: '💧', tip: 'Fresh water should be available always' },
    { emoji: '🏃', tip: 'Daily exercise supports long-term health' },
  ];

  const ageLabel =
    primary?.age != null && !Number.isNaN(Number(primary.age)) ? `${primary.age} years` : 'Age not set';
  const breedLine =
    [primary?.breed || primary?.animal_type].filter(Boolean).join(' • ') || 'Pet profile';

  return (
    <MobileContainer>
      <div className="h-full bg-[#F8F7F3] overflow-y-auto pb-20">
        <div className="bg-gradient-to-br from-[#0B1220] via-[#0B1220] to-[#059669] px-6 pt-12 pb-10 rounded-b-[36px] relative overflow-hidden">
          <div className="absolute top-4 right-4 text-white/5 text-8xl select-none">🐾</div>
          <div className="absolute bottom-4 left-4 text-white/5 text-6xl select-none">🐾</div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🐾</span>
                <span className="text-white/60 text-sm font-medium">Pashvik</span>
              </div>
              <h1 className="text-white text-2xl" style={{ fontWeight: 700 }}>
                Good morning! 👋
              </h1>
              <p className="text-white/60 text-sm mt-1">Your pet hub — data you add shows up here.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/profile')}
                className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20"
              >
                <User className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => navigate('/premium')}
                className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20"
              >
                <Crown className="w-5 h-5 text-[#C9A227]" />
              </button>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-sm rounded-[24px] p-4 border border-white/20 relative z-10">
            {loading ? (
              <p className="text-white/80 text-sm">Loading your pets…</p>
            ) : primary ? (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/20 ring-2 ring-white/30">
                  <ImageWithFallback
                    src={primary.photo || PLACEHOLDER_PET}
                    alt={primary.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white text-lg" style={{ fontWeight: 700 }}>
                      {primary.name}
                    </h3>
                    <span className="bg-[#059669] text-white text-xs px-2 py-0.5 rounded-full">
                      {primary.vaccination_status === 'Up to date' ? 'Healthy ✓' : 'Check vaccines'}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm">
                    {breedLine} • {ageLabel}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-white/60 text-xs">
                      Add visits and records as you go
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/pets')}
                  className="bg-white/20 text-white text-xs px-3 py-2 rounded-xl border border-white/30"
                  style={{ fontWeight: 600 }}
                >
                  View
                </button>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-white/90 text-sm mb-3">No pet profile yet.</p>
                <button
                  onClick={() => navigate('/add-pet')}
                  className="bg-white text-[#059669] px-4 py-2 rounded-xl text-sm font-semibold"
                >
                  Add your pet
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 mt-5">
          <button
            onClick={() => navigate('/consultation')}
            className="w-full bg-red-50 border-2 border-red-200 rounded-[20px] p-4 flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-red-600 font-bold text-sm">Emergency SOS</p>
              <p className="text-red-400 text-xs">Connect to vet immediately</p>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400" />
          </button>
        </div>

        <div className="px-6 mt-6">
          <h2 className="text-[#111827] text-xl mb-4" style={{ fontWeight: 700 }}>
            🐾 Services
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {featureCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <button
                  key={idx}
                  onClick={() => navigate(card.path)}
                  className="bg-white rounded-[20px] p-4 shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 active:scale-95"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${card.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: card.color }} strokeWidth={2} />
                  </div>
                  <span className="text-[#111827] text-xs text-center" style={{ fontWeight: 600 }}>
                    {card.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-6 mt-6">
          <h2 className="text-[#111827] text-xl mb-4" style={{ fontWeight: 700 }}>
            💡 Daily Pet Tips
          </h2>
          <div className="space-y-3">
            {healthTips.map((tip, idx) => (
              <div key={idx} className="bg-white rounded-[16px] p-4 shadow-sm flex items-center gap-3">
                <span className="text-2xl">{tip.emoji}</span>
                <p className="text-[#374151] text-sm" style={{ fontWeight: 500 }}>
                  {tip.tip}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 mt-6 mb-6">
          <h2 className="text-[#111827] text-xl mb-4" style={{ fontWeight: 700 }}>
            🔔 Upcoming
          </h2>
          {nextReminder ? (
            <div className="bg-gradient-to-r from-[#059669] to-[#047857] rounded-[20px] p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">{nextReminder.title}</p>
                <p className="text-white/70 text-xs">Due {nextReminder.due_date}</p>
              </div>
              <button
                onClick={() => navigate('/reminders')}
                className="bg-white/20 text-white text-xs px-3 py-2 rounded-xl"
                style={{ fontWeight: 600 }}
              >
                View
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-[20px] p-5 shadow-sm border border-[#E5E7EB]">
              <p className="text-[#6B7280] text-sm mb-3">No reminders yet. Add checkups and vaccines from Reminders.</p>
              <button
                onClick={() => navigate('/reminders')}
                className="text-[#059669] text-sm font-semibold"
              >
                Open Reminders
              </button>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
      <PetoButton />
    </MobileContainer>
  );
}
