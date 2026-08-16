import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import MobileContainer from '../components/MobileContainer';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { getStoredToken } from '../../lib/session';
import type { ApiVet } from '../../lib/vetAdapters';

type Pet = { id: number; name: string };

export default function BookAppointment() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type') || 'video';

  const [vet, setVet] = useState<{ name: string; fee: number } | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [petId, setPetId] = useState<number | ''>('');
  const [selectedDate, setSelectedDate] = useState('2026-04-22');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [consultationType, setConsultationType] = useState<'video' | 'chat' | 'home'>(
    typeParam === 'home' ? 'home' : typeParam === 'chat' ? 'chat' : 'video'
  );
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const dates = ['2026-04-22', '2026-04-23', '2026-04-24', '2026-04-25'];
  const times = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];

  const vetNumericId = id ? parseInt(id, 10) : NaN;

  useEffect(() => {
    if (!getStoredToken()) {
      navigate('/login', { replace: true });
      return;
    }
    let cancelled = false;
    (async () => {
      const [vr, pr] = await Promise.all([apiFetch('/vets'), apiFetch('/pets')]);
      const vj = await vr.json();
      const pj = await pr.json();
      if (!cancelled && vr.ok && Array.isArray(vj.vets) && !Number.isNaN(vetNumericId)) {
        const v = (vj.vets as ApiVet[]).find((x) => x.id === vetNumericId);
        if (v) setVet({ name: v.name, fee: v.fee });
      }
      if (!cancelled && pr.ok && Array.isArray(pj.pets)) {
        setPets(pj.pets);
        if (pj.pets.length) setPetId(pj.pets[0].id);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id, navigate, vetNumericId]);

  const fee =
    consultationType === 'home' && vet ? vet.fee + 250 : vet ? vet.fee : 400;

  const bookAppointment = async () => {
    setMsg('');
    if (!vet || Number.isNaN(vetNumericId)) {
      setMsg('Could not load vet');
      return;
    }
    if (petId === '') {
      setMsg('Select a pet');
      return;
    }
    setBooking(true);
    try {
      const res = await apiFetch('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          vet_id: vetNumericId,
          pet_id: petId,
          date: selectedDate,
          time: selectedTime,
          type: consultationType,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setMsg(typeof j.detail === 'string' ? j.detail : 'Could not book appointment.');
        return;
      }
      setSuccessOpen(true);
    } finally {
      setBooking(false);
    }
  };

  return (
    <MobileContainer>
      <div className="h-full min-h-0 flex flex-col bg-[#F8F7F3] relative overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="bg-gradient-to-r from-[#0B1220] to-[#059669] px-6 pt-12 pb-6 rounded-b-[30px]">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-2xl" style={{ fontWeight: 700 }}>
            Book Appointment
          </h1>
        </div>

        <div className="px-6 py-6 space-y-6">
          {msg ? <div className="text-sm text-red-600 bg-red-50 rounded-xl p-3">{msg}</div> : null}
          {loading ? (
            <p className="text-[#6B7280] text-sm">Loading…</p>
          ) : (
            <>
              <div>
                <label className="text-[#111827] text-base mb-3 block" style={{ fontWeight: 700 }}>
                  Your pet
                </label>
                <select
                  value={petId === '' ? '' : String(petId)}
                  onChange={(e) => setPetId(e.target.value ? Number(e.target.value) : '')}
                  className="w-full rounded-xl border border-[#E5E7EB] px-3 py-3 text-sm bg-white"
                >
                  {pets.length === 0 ? <option value="">Add a pet first</option> : null}
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#111827] text-base mb-3 block" style={{ fontWeight: 700 }}>
                  Consultation Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      ['video', 'Video'],
                      ['chat', 'Chat'],
                      ['home', 'Home'],
                    ] as const
                  ).map(([k, label]) => (
                    <button
                      key={k}
                      onClick={() => setConsultationType(k)}
                      className={`py-3 px-2 rounded-xl border-2 transition-all text-xs ${
                        consultationType === k
                          ? 'border-[#059669] bg-[#059669]/5 text-[#059669]'
                          : 'border-[#E5E7EB] bg-white text-[#6B7280]'
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-[#111827]" />
                  <label className="text-[#111827] text-base" style={{ fontWeight: 700 }}>
                    Date
                  </label>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {dates.map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`px-5 py-3 rounded-xl whitespace-nowrap transition-all text-sm ${
                        selectedDate === date
                          ? 'bg-[#059669] text-white shadow-lg'
                          : 'bg-white text-[#6B7280] border border-[#E5E7EB]'
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-[#111827]" />
                  <label className="text-[#111827] text-base" style={{ fontWeight: 700 }}>
                    Time
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {times.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 rounded-xl transition-all text-sm ${
                        selectedTime === time
                          ? 'bg-[#059669] text-white shadow-lg'
                          : 'bg-white text-[#6B7280] border border-[#E5E7EB]'
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[20px] p-5 shadow-sm">
                <h3 className="text-[#111827] text-base mb-4" style={{ fontWeight: 700 }}>
                  Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280] text-sm">Doctor</span>
                    <span className="text-[#111827] text-sm" style={{ fontWeight: 600 }}>
                      {vet?.name ?? '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280] text-sm">Slot</span>
                    <span className="text-[#111827] text-sm" style={{ fontWeight: 600 }}>
                      {selectedDate} · {selectedTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280] text-sm">Type</span>
                    <span className="text-[#111827] text-sm" style={{ fontWeight: 600 }}>
                      {consultationType}
                    </span>
                  </div>
                  <div className="h-px bg-[#E5E7EB]" />
                  <div className="flex justify-between">
                    <span className="text-[#111827] text-base" style={{ fontWeight: 600 }}>
                      Consultation fee
                    </span>
                    <span className="text-[#059669] text-xl" style={{ fontWeight: 700 }}>
                      ₹{fee}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={bookAppointment}
                disabled={!vet || pets.length === 0 || booking}
                className="w-full py-4 bg-[#059669] text-white rounded-xl hover:bg-[#047857] transition-colors shadow-lg disabled:opacity-50"
                style={{ fontWeight: 600 }}
              >
                {booking ? 'Booking…' : 'Book'}
              </button>
            </>
          )}

          <div className="pb-6"></div>
        </div>
      </div>

      {successOpen ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-success-title"
          >
            <h2 id="book-success-title" className="text-lg text-[#111827] text-center mb-2" style={{ fontWeight: 700 }}>
              Appointment booked
            </h2>
            <p className="text-sm text-[#6B7280] text-center mb-6">Your appointment is booked.</p>
            <button
              type="button"
              onClick={() => {
                setSuccessOpen(false);
                navigate('/appointment-history', { replace: false });
              }}
              className="w-full py-3 rounded-xl bg-[#059669] text-white text-sm hover:bg-[#047857]"
              style={{ fontWeight: 600 }}
            >
              OK
            </button>
          </div>
        </div>
      ) : null}
      </div>
    </MobileContainer>
  );
}
