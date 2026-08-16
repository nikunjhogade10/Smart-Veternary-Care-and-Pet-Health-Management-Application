import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import MobileContainer from '../components/MobileContainer';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ArrowLeft, Star, Video, MessageSquare, MapPin, Clock, Home as HomeIcon, AlertCircle, Calendar } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { type ApiVet, toConsultationVet } from '../../lib/vetAdapters';

type VetView = {
  name: string;
  specialization: string;
  rating: number;
  reviews: number;
  fee: number;
  experience: string;
  available: boolean;
  image: string;
  location: string;
  about: string;
  workingHours: string;
  homeVisitAvailable: boolean;
  homeVisitFee: number;
  estimatedArrival: string;
  emergency: boolean;
};

export default function VetDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const consultationType = searchParams.get('type');
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [vet, setVet] = useState<VetView | null>(null);
  const [loading, setLoading] = useState(true);

  const numericId = id ? parseInt(id, 10) : NaN;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (Number.isNaN(numericId)) {
        setVet(null);
        setLoading(false);
        return;
      }
      const res = await apiFetch('/vets');
      const data = await res.json();
      const raw = Array.isArray(data.vets)
        ? (data.vets as ApiVet[]).find((v) => v.id === numericId)
        : undefined;
      if (cancelled) return;
      if (raw) {
        const c = toConsultationVet(raw);
        setVet({
          name: c.name,
          specialization: c.specialization,
          rating: c.rating,
          reviews: c.reviews,
          fee: c.fee,
          experience: 'Licensed veterinarian',
          available: c.available,
          image: c.image,
          location: `${raw.city ?? 'Local'} area`,
          about: `${c.name} focuses on ${c.specialization.toLowerCase()} care and routine wellness for pets.`,
          workingHours: 'Mon–Sat: 9:00 AM – 7:00 PM',
          homeVisitAvailable: c.homeVisitAvailable,
          homeVisitFee: c.homeVisitFee,
          estimatedArrival: c.estimatedArrival ?? '~45 mins',
          emergency: c.emergency,
        });
      } else {
        setVet(null);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [numericId]);

  const availableTimeSlots = [
    { id: 1, date: 'Today', time: '3:00 PM', available: true },
    { id: 2, date: 'Today', time: '5:00 PM', available: true },
    { id: 3, date: 'Tomorrow', time: '10:00 AM', available: true },
    { id: 4, date: 'Tomorrow', time: '2:00 PM', available: true },
    { id: 5, date: 'Tomorrow', time: '4:00 PM', available: false },
  ];

  if (loading) {
    return (
      <MobileContainer>
        <div className="h-full flex items-center justify-center text-[#6B7280] text-sm">Loading…</div>
      </MobileContainer>
    );
  }

  if (!vet) {
    return (
      <MobileContainer>
        <div className="p-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-[#059669] font-semibold text-sm"
          >
            ← Back
          </button>
          <p className="text-[#6B7280] mt-6">We could not load this veterinarian.</p>
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer>
      <div className="h-full bg-[#F8F7F3] overflow-y-auto">
        {/* Header Image */}
        <div className="relative h-64 bg-[#F3F4F6]">
          <ImageWithFallback
            src={vet.image}
            alt={vet.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220]/40 to-transparent"></div>
          
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-12 left-6 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 text-[#111827]" />
          </button>

          {/* Availability Badge */}
          <div className="absolute top-12 right-6">
            <span 
              className={`px-4 py-2 rounded-full text-sm backdrop-blur-sm ${
                vet.available 
                  ? 'bg-[#059669]/90 text-white' 
                  : 'bg-[#6B7280]/90 text-white'
              }`}
              style={{ fontWeight: 600 }}
            >
              {vet.available ? 'Available Now' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Vet Info */}
          <div className="mb-6">
            <h1 className="text-[#111827] text-2xl mb-2" style={{ fontWeight: 700 }}>
              {vet.name}
            </h1>
            <p className="text-[#6B7280] text-base mb-3">
              {vet.specialization}
            </p>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-[#C9A227]" fill="#C9A227" />
                <span className="text-[#111827] text-base" style={{ fontWeight: 600 }}>
                  {vet.rating}
                </span>
                <span className="text-[#6B7280] text-sm">
                  ({vet.reviews} reviews)
                </span>
              </div>
              <div className="h-5 w-px bg-[#E5E7EB]"></div>
              <span className="text-[#6B7280] text-sm">{vet.experience}</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#6B7280] text-sm">
                <MapPin className="w-4 h-4" />
                <span>{vet.location}</span>
              </div>
              <div className="flex items-center gap-2 text-[#6B7280] text-sm">
                <Clock className="w-4 h-4" />
                <span>{vet.workingHours}</span>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="mb-6">
            <h2 className="text-[#111827] text-lg mb-3" style={{ fontWeight: 700 }}>
              About
            </h2>
            <p className="text-[#6B7280] text-sm leading-relaxed">
              {vet.about}
            </p>
          </div>

          {/* Consultation Fee */}
          <div className="bg-white rounded-[20px] p-5 mb-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#6B7280] text-sm mb-1">Consultation Fee</p>
                <p className="text-[#111827] text-2xl" style={{ fontWeight: 700 }}>
                  ₹{vet.fee}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[#6B7280] text-xs">per session</p>
              </div>
            </div>
          </div>

          {/* Available Time Slots */}
          <div className="mb-6">
            <button
              onClick={() => setShowTimeSlots(!showTimeSlots)}
              className="w-full bg-white rounded-[20px] p-5 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#059669]" />
                <div className="text-left">
                  <p className="text-[#111827] text-base mb-1" style={{ fontWeight: 600 }}>
                    View Available Time Slots
                  </p>
                  <p className="text-[#6B7280] text-xs">
                    Check availability before booking
                  </p>
                </div>
              </div>
              <ArrowLeft className={`w-5 h-5 text-[#6B7280] transition-transform ${showTimeSlots ? '-rotate-90' : 'rotate-180'}`} />
            </button>

            {showTimeSlots && (
              <div className="mt-3 bg-white rounded-[20px] p-5 shadow-sm">
                <div className="space-y-2">
                  {availableTimeSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`flex items-center justify-between p-3 rounded-xl ${
                        slot.available 
                          ? 'bg-[#059669]/5 border border-[#059669]/20' 
                          : 'bg-[#F3F4F6] border border-[#E5E7EB]'
                      }`}
                    >
                      <div>
                        <p className={`text-sm ${slot.available ? 'text-[#111827]' : 'text-[#6B7280]'}`} style={{ fontWeight: 600 }}>
                          {slot.date}, {slot.time}
                        </p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        slot.available 
                          ? 'bg-[#059669] text-white' 
                          : 'bg-[#6B7280] text-white'
                      }`} style={{ fontWeight: 600 }}>
                        {slot.available ? 'Available' : 'Booked'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Consultation Options */}
          <div className="mb-6">
            <h2 className="text-[#111827] text-lg mb-4" style={{ fontWeight: 700 }}>
              Consultation Options
            </h2>
            
            <div className="space-y-3">
              {/* Video Consultation */}
              <div className={`bg-white rounded-[20px] p-4 shadow-sm border-2 ${
                consultationType === 'video' ? 'border-[#059669]' : 'border-transparent'
              }`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#059669]/10 flex items-center justify-center">
                    <Video className="w-5 h-5 text-[#059669]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#111827] text-base mb-1" style={{ fontWeight: 600 }}>
                      Video Consultation
                    </h3>
                    <p className="text-[#6B7280] text-xs">
                      Connect with vet via video call
                    </p>
                  </div>
                  <span className="text-[#111827] text-sm" style={{ fontWeight: 700 }}>₹{vet.fee}</span>
                </div>
                <button
                  onClick={() => navigate(`/book-appointment/${id}?type=video`)}
                  className="w-full py-2.5 bg-[#059669] text-white rounded-xl hover:bg-[#047857] transition-colors"
                  style={{ fontWeight: 600, fontSize: '14px' }}
                >
                  Book Video Call
                </button>
              </div>

              {/* Chat Consultation */}
              <div className={`bg-white rounded-[20px] p-4 shadow-sm border-2 ${
                consultationType === 'chat' ? 'border-[#059669]' : 'border-transparent'
              }`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#059669]/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-[#059669]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#111827] text-base mb-1" style={{ fontWeight: 600 }}>
                      Chat Consultation
                    </h3>
                    <p className="text-[#6B7280] text-xs">
                      Message with vet at your convenience
                    </p>
                  </div>
                  <span className="text-[#111827] text-sm" style={{ fontWeight: 700 }}>₹{vet.fee}</span>
                </div>
                <button
                  onClick={() => navigate(`/chat/${id}`)}
                  className="w-full py-2.5 bg-[#059669] text-white rounded-xl hover:bg-[#047857] transition-colors"
                  style={{ fontWeight: 600, fontSize: '14px' }}
                >
                  Start Chat
                </button>
              </div>

              {/* Home Visit */}
              {vet.homeVisitAvailable && (
                <div className={`bg-white rounded-[20px] p-4 shadow-sm border-2 ${
                  consultationType === 'home' ? 'border-[#C9A227]' : 'border-transparent'
                }`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#C9A227]/10 flex items-center justify-center">
                      <HomeIcon className="w-5 h-5 text-[#C9A227]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#111827] text-base mb-1" style={{ fontWeight: 600 }}>
                        Home Visit
                      </h3>
                      <p className="text-[#6B7280] text-xs mb-2">
                        Vet will visit your location
                      </p>
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-[#6B7280]">ETA:</span>
                          <span className="text-[#111827]" style={{ fontWeight: 600 }}>{vet.estimatedArrival}</span>
                        </div>
                        <div className="h-3 w-px bg-[#E5E7EB]"></div>
                        <span className="text-[#111827]" style={{ fontWeight: 700 }}>₹{vet.homeVisitFee}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/book-appointment/${id}?type=home`)}
                    className="w-full py-2.5 bg-[#C9A227] text-white rounded-xl hover:bg-[#B89120] transition-colors"
                    style={{ fontWeight: 600, fontSize: '14px' }}
                  >
                    Book Home Visit
                  </button>
                </div>
              )}

              {/* Emergency Consultation */}
              {vet.emergency && (
                <div className={`bg-white rounded-[20px] p-4 shadow-sm border-2 ${
                  consultationType === 'emergency' ? 'border-red-500' : 'border-red-300'
                }`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#111827] text-base mb-1" style={{ fontWeight: 600 }}>
                        Emergency Consultation
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full" style={{ fontWeight: 600 }}>
                          Available Now
                        </span>
                      </div>
                      <p className="text-[#6B7280] text-xs">
                        Instant connect for urgent cases
                      </p>
                    </div>
                    <span className="text-red-600 text-sm" style={{ fontWeight: 700 }}>₹{vet.fee + 200}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => navigate(`/video-call/${id}?emergency=true`)}
                      className="py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                      style={{ fontWeight: 600, fontSize: '14px' }}
                    >
                      Call Now
                    </button>
                    <button
                      onClick={() => navigate(`/chat/${id}?emergency=true`)}
                      className="py-2.5 bg-red-50 text-red-600 border border-red-300 rounded-xl hover:bg-red-100 transition-colors"
                      style={{ fontWeight: 600, fontSize: '14px' }}
                    >
                      Chat Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pb-6"></div>
        </div>
      </div>
    </MobileContainer>
  );
}