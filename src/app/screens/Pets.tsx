import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import MobileContainer from '../components/MobileContainer';
import BottomNav from '../components/BottomNav';
import PetoButton from '../components/PetoButton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Plus, ArrowLeft } from 'lucide-react';
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

const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect fill="%23F3F4F6" width="128" height="128" rx="24"/><text x="64" y="78" text-anchor="middle" font-size="48">🐾</text></svg>`
  );

export default function Pets() {
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getStoredToken()) {
      navigate('/login', { replace: true });
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await apiFetch('/pets');
      const data = await res.json();
      if (!cancelled && res.ok && Array.isArray(data.pets)) setPets(data.pets);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <MobileContainer>
      <div className="h-full bg-[#F8F7F3] overflow-y-auto pb-20">
        <div className="bg-gradient-to-r from-[#0B1220] to-[#059669] px-6 pt-12 relative pb-6 rounded-b-[30px]">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-white/80 hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-white text-2xl" style={{ fontWeight: 700 }}>
              My Pets
            </h1>
            <button
              onClick={() => navigate('/add-pet')}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="px-6 py-6 space-y-4">
          {loading ? (
            <p className="text-[#6B7280] text-sm">Loading…</p>
          ) : pets.length === 0 ? (
            <div className="bg-white rounded-[20px] p-8 text-center shadow-sm">
              <p className="text-[#6B7280] mb-4">You have not added a pet yet.</p>
              <button
                onClick={() => navigate('/add-pet')}
                className="bg-[#059669] text-white px-5 py-3 rounded-xl text-sm font-semibold"
              >
                Add a pet
              </button>
            </div>
          ) : (
            pets.map((pet) => (
              <div key={pet.id} className="bg-white rounded-[20px] p-5 shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#F3F4F6]">
                    <ImageWithFallback
                      src={pet.photo || PLACEHOLDER}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#111827] text-xl mb-1" style={{ fontWeight: 700 }}>
                      {pet.name}
                    </h3>
                    <p className="text-[#6B7280] text-sm mb-1">{pet.breed || pet.animal_type}</p>
                    <p className="text-[#6B7280] text-xs">
                      {pet.age != null ? `${pet.age} yrs` : 'Age —'} •{' '}
                      {pet.weight != null ? `${pet.weight} kg` : 'Weight —'}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-[#E5E7EB] mb-4"></div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280] text-sm">Vaccination Status</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        pet.vaccination_status === 'Up to date'
                          ? 'bg-[#059669]/10 text-[#059669]'
                          : 'bg-[#C9A227]/10 text-[#C9A227]'
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      {pet.vaccination_status || 'Not set'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280] text-sm">Next Checkup</span>
                    <span className="text-[#111827] text-sm" style={{ fontWeight: 600 }}>
                      Add in Reminders
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    onClick={() => navigate('/records')}
                    className="py-2.5 bg-[#F3F4F6] text-[#111827] rounded-xl text-sm hover:bg-[#E5E7EB] transition-colors"
                    style={{ fontWeight: 600 }}
                  >
                    View Records
                  </button>
                  <button
                    onClick={() => navigate('/consultation')}
                    className="py-2.5 bg-[#059669] text-white rounded-xl text-sm hover:bg-[#047857] transition-colors"
                    style={{ fontWeight: 600 }}
                  >
                    Book Consult
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <BottomNav />
      <PetoButton />
    </MobileContainer>
  );
}
