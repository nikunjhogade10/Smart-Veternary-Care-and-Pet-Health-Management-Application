import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import MobileContainer from '../components/MobileContainer';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ArrowLeft, Video, MessageSquare, Home as HomeIcon, Calendar, Clock, AlertCircle } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { getStoredToken } from '../../lib/session';

type AppointmentApi = {
  id: number;
  vet_id: number;
  vet_name: string;
  vet_image: string | null;
  pet_id: number;
  pet_name: string;
  date: string;
  time: string;
  type: string;
  status: string;
};

export default function AppointmentHistory() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [rows, setRows] = useState<AppointmentApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getStoredToken()) {
      navigate('/login', { replace: true });
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await apiFetch('/appointments');
      const data = await res.json();
      if (!cancelled && res.ok && Array.isArray(data.appointments)) {
        setRows(data.appointments);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const { upcomingAppointments, pastAppointments } = useMemo(() => {
    const upcoming = rows.filter((a) => a.status === 'confirmed' || a.status === 'scheduled');
    const past = rows.filter((a) => a.status === 'completed');
    return { upcomingAppointments: upcoming, pastAppointments: past };
  }, [rows]);

  const appointments = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'chat':
        return <MessageSquare className="w-4 h-4" />;
      case 'home':
        return <HomeIcon className="w-4 h-4" />;
      case 'emergency':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
      case 'chat':
        return '#059669';
      case 'home':
        return '#C9A227';
      case 'emergency':
        return '#DC2626';
      default:
        return '#6B7280';
    }
  };

  const placeholder =
    'data:image/svg+xml,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect fill="%23F3F4F6" width="64" height="64" rx="12"/><text x="32" y="38" text-anchor="middle" font-size="22">👩‍⚕️</text></svg>`
    );

  return (
    <MobileContainer>
      <div className="h-full bg-[#F8F7F3] overflow-y-auto">
        <div className="bg-gradient-to-r from-[#0B1220] to-[#059669] px-6 pt-12 pb-6 rounded-b-[30px] relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-12 left-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <h1 className="text-white text-2xl mb-4" style={{ fontWeight: 700 }}>
            Appointment History
          </h1>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                activeTab === 'upcoming' ? 'bg-white text-[#059669]' : 'bg-white/10 text-white/80'
              }`}
              style={{ fontWeight: 600 }}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                activeTab === 'past' ? 'bg-white text-[#059669]' : 'bg-white/10 text-white/80'
              }`}
              style={{ fontWeight: 600 }}
            >
              Past
            </button>
          </div>
        </div>

        <div className="px-6 py-6 space-y-4">
          {loading ? (
            <p className="text-[#6B7280] text-sm">Loading…</p>
          ) : appointments.length === 0 ? (
            <div className="bg-white rounded-[20px] p-8 text-center">
              <Calendar className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
              <p className="text-[#6B7280] text-base">No {activeTab} appointments</p>
              <p className="text-[#9CA3AF] text-xs mt-2">Book a vet from Consultation to see them here.</p>
            </div>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-[20px] p-4 shadow-sm">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F3F4F6]">
                    <ImageWithFallback
                      src={appointment.vet_image || placeholder}
                      alt={appointment.vet_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#111827] text-base mb-1" style={{ fontWeight: 600 }}>
                      {appointment.vet_name}
                    </h3>
                    <p className="text-[#6B7280] text-xs">Pet: {appointment.pet_name}</p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs text-white"
                    style={{
                      fontWeight: 600,
                      backgroundColor: appointment.status === 'confirmed' ? '#059669' : '#6B7280',
                    }}
                  >
                    {appointment.status === 'confirmed' ? 'Confirmed' : 'Completed'}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#6B7280]" />
                    <span className="text-[#6B7280] text-sm">{appointment.date}</span>
                  </div>
                  <div className="h-4 w-px bg-[#E5E7EB]"></div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#6B7280]" />
                    <span className="text-[#6B7280] text-sm">{appointment.time}</span>
                  </div>
                </div>

                <div
                  className="flex items-center gap-2 mb-4 p-3 rounded-xl"
                  style={{ backgroundColor: `${getTypeColor(appointment.type)}15` }}
                >
                  <div style={{ color: getTypeColor(appointment.type) }}>
                    {getTypeIcon(appointment.type)}
                  </div>
                  <span
                    className="text-sm capitalize"
                    style={{ color: getTypeColor(appointment.type), fontWeight: 600 }}
                  >
                    {appointment.type === 'home' ? 'Home Visit' : `${appointment.type} Consultation`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {appointment.status === 'confirmed' ? (
                    <>
                      <button
                        onClick={() => navigate(`/vet/${appointment.vet_id}`)}
                        className="py-2.5 bg-[#059669] text-white rounded-xl hover:bg-[#047857] transition-colors"
                        style={{ fontWeight: 600, fontSize: '14px' }}
                      >
                        View Details
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/consultation')}
                        className="py-2.5 bg-white border border-[#E5E7EB] text-[#111827] rounded-xl hover:bg-[#F3F4F6] transition-colors"
                        style={{ fontWeight: 600, fontSize: '14px' }}
                      >
                        Book again
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => navigate(`/vet/${appointment.vet_id}`)}
                        className="py-2.5 bg-[#059669] text-white rounded-xl hover:bg-[#047857] transition-colors"
                        style={{ fontWeight: 600, fontSize: '14px' }}
                      >
                        Book Again
                      </button>
                      <button
                        type="button"
                        className="py-2.5 bg-white border border-[#E5E7EB] text-[#111827] rounded-xl hover:bg-[#F3F4F6] transition-colors"
                        style={{ fontWeight: 600, fontSize: '14px' }}
                      >
                        Prescription
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MobileContainer>
  );
}
