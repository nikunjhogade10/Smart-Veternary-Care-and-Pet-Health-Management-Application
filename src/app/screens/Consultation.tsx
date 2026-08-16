import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import MobileContainer from '../components/MobileContainer';
import BottomNav from '../components/BottomNav';
import PetoButton from '../components/PetoButton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import {
  Star,
  Search,
  Video,
  MessageSquare,
  Home as HomeIcon,
  AlertCircle,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { type ApiVet, toConsultationVet, vetMatchesSpec, type ConsultationVet } from '../../lib/vetAdapters';

export default function Consultation() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [rawVets, setRawVets] = useState<ApiVet[]>([]);
  const [loading, setLoading] = useState(true);

  const specializations = ['All', 'General', 'Surgery', 'Dental', 'Nutrition', 'Emergency', 'Exotics'];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await apiFetch('/vets');
      const data = await res.json();
      if (!cancelled && res.ok && Array.isArray(data.vets)) setRawVets(data.vets);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const vets = useMemo(() => rawVets.map(toConsultationVet), [rawVets]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return vets.filter((v) => {
      if (!vetMatchesSpec(v, selectedSpecialization)) return false;
      if (!q) return true;
      return (
        v.name.toLowerCase().includes(q) || v.specialization.toLowerCase().includes(q)
      );
    });
  }, [vets, searchQuery, selectedSpecialization]);

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
          <h1 className="text-white text-2xl mb-4" style={{ fontWeight: 700 }}>
            Find a Veterinarian
          </h1>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or specialization..."
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {specializations.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialization(spec)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  selectedSpecialization === spec
                    ? 'bg-[#059669] text-white'
                    : 'bg-white text-[#6B7280] border border-[#E5E7EB]'
                }`}
                style={{ fontWeight: 600 }}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {loading ? (
            <p className="text-[#6B7280] text-sm">Loading veterinarians…</p>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-[20px] p-8 text-center text-[#6B7280] text-sm shadow-sm">
              No vets match your filters.
            </div>
          ) : (
            filtered.map((vet: ConsultationVet) => (
              <div
                key={vet.id}
                className={`bg-white rounded-[20px] p-4 shadow-sm ${vet.emergency ? 'ring-2 ring-red-500' : ''}`}
              >
                {vet.emergency && (
                  <div className="mb-3 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-red-600 text-sm" style={{ fontWeight: 600 }}>
                      Emergency vet
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-3 mb-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#F3F4F6]">
                    <ImageWithFallback
                      src={vet.image}
                      alt={vet.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#111827] text-base mb-1" style={{ fontWeight: 700 }}>
                      {vet.name}
                    </h3>
                    <p className="text-[#6B7280] text-sm mb-1">{vet.specialization}</p>
                    <p className="text-[#6B7280] text-xs">{vet.experience} experience</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      vet.available ? 'bg-[#059669]/10 text-[#059669]' : 'bg-[#6B7280]/10 text-[#6B7280]'
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {vet.available ? 'Available' : 'Offline'}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-[#C9A227]" fill="#C9A227" />
                    <span className="text-[#111827] text-sm" style={{ fontWeight: 600 }}>
                      {vet.rating}
                    </span>
                    <span className="text-[#6B7280] text-xs">({vet.reviews} reviews)</span>
                  </div>
                  <div className="h-4 w-px bg-[#E5E7EB]"></div>
                  <div>
                    <span className="text-[#111827] text-sm" style={{ fontWeight: 700 }}>
                      ₹{vet.fee}
                    </span>
                    <span className="text-[#6B7280] text-xs"> / session</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4 bg-[#F3F4F6] rounded-xl px-3 py-2">
                  <Clock className="w-4 h-4 text-[#059669]" />
                  <span className="text-[#6B7280] text-xs">Next available:</span>
                  <span className="text-[#111827] text-xs" style={{ fontWeight: 600 }}>
                    {vet.nextSlot}
                  </span>
                </div>

                {vet.homeVisitAvailable && vet.estimatedArrival && (
                  <div className="mb-4 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <HomeIcon className="w-4 h-4 text-[#C9A227]" />
                        <span className="text-[#C9A227] text-sm" style={{ fontWeight: 600 }}>
                          Home Visit Available
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-[#6B7280]">Visiting charge:</span>
                        <span className="text-[#111827]" style={{ fontWeight: 600 }}>
                          ₹{vet.homeVisitFee}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[#6B7280]">ETA:</span>
                        <span className="text-[#111827]" style={{ fontWeight: 600 }}>
                          {vet.estimatedArrival}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    onClick={() => navigate(`/vet/${vet.id}?type=video`)}
                    className="py-2.5 px-3 bg-[#059669]/10 border border-[#059669] text-[#059669] rounded-xl flex items-center justify-center gap-2 hover:bg-[#059669]/20 transition-colors"
                    style={{ fontWeight: 600, fontSize: '12px' }}
                  >
                    <Video className="w-4 h-4" />
                    Video
                  </button>
                  <button
                    onClick={() => navigate(`/vet/${vet.id}?type=chat`)}
                    className="py-2.5 px-3 bg-[#059669]/10 border border-[#059669] text-[#059669] rounded-xl flex items-center justify-center gap-2 hover:bg-[#059669]/20 transition-colors"
                    style={{ fontWeight: 600, fontSize: '12px' }}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Chat
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  {vet.homeVisitAvailable && (
                    <button
                      onClick={() => navigate(`/vet/${vet.id}?type=home`)}
                      className="py-2.5 px-3 bg-[#C9A227]/10 border border-[#C9A227] text-[#C9A227] rounded-xl flex items-center justify-center gap-2 hover:bg-[#C9A227]/20 transition-colors"
                      style={{ fontWeight: 600, fontSize: '12px' }}
                    >
                      <HomeIcon className="w-4 h-4" />
                      Home Visit
                    </button>
                  )}
                  {vet.emergency && (
                    <button
                      onClick={() => navigate(`/vet/${vet.id}?type=emergency`)}
                      className={`py-2.5 px-3 bg-red-50 border border-red-500 text-red-600 rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors ${
                        vet.homeVisitAvailable ? '' : 'col-span-2'
                      }`}
                      style={{ fontWeight: 600, fontSize: '12px' }}
                    >
                      <AlertCircle className="w-4 h-4" />
                      Emergency
                    </button>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/vet/${vet.id}`)}
                  className="w-full py-3 bg-[#059669] text-white rounded-xl hover:bg-[#047857] transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  View Profile & Book
                </button>
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
