import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import MobileContainer from '../components/MobileContainer';
import BottomNav from '../components/BottomNav';
import PetoButton from '../components/PetoButton';
import { ArrowLeft, Cake, Calendar, MapPin, MessageCircle, Sparkles, Coffee } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { getStoredToken } from '../../lib/session';
import { googleMapsDirectionsUrl } from '../../lib/maps';

type Post = {
  id: number;
  author_label: string;
  body: string;
  pet_name?: string | null;
  created_at?: string | null;
};

type EventRow = {
  id: string;
  type: string;
  title: string;
  description?: string;
  event_date: string;
  time?: string;
  location?: string;
  lat?: number | null;
  lng?: number | null;
  pet_name?: string;
};

type Cafe = {
  id: string;
  name: string;
  area: string;
  address: string;
  lat: number;
  lng: number;
  price_per_visit_paise: number;
  description: string;
};

export default function Community() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'feed' | 'events' | 'cafes'>('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [paymentDoneOpen, setPaymentDoneOpen] = useState(false);
  const [paidCafeName, setPaidCafeName] = useState('');

  const refresh = async () => {
    const [pr, er, cr] = await Promise.all([
      apiFetch('/community/posts'),
      apiFetch('/community/events'),
      apiFetch('/community/cafes'),
    ]);
    const pj = await pr.json();
    const ej = await er.json();
    const cj = await cr.json();
    if (pr.ok && Array.isArray(pj.posts)) setPosts(pj.posts);
    if (er.ok && Array.isArray(ej.events)) setEvents(ej.events);
    if (cr.ok && Array.isArray(cj.cafes)) setCafes(cj.cafes);
    setLoading(false);
  };

  useEffect(() => {
    if (!getStoredToken()) {
      navigate('/login', { replace: true });
      return;
    }
    refresh();
  }, [navigate]);

  const submitPost = async () => {
    if (!draft.trim()) return;
    const res = await apiFetch('/community/posts', {
      method: 'POST',
      body: JSON.stringify({ body: draft.trim() }),
    });
    if (res.ok) {
      setDraft('');
      await refresh();
    }
  };

  const payForCafe = (cafe: Cafe) => {
    setPaidCafeName(cafe.name);
    setPaymentDoneOpen(true);
  };

  return (
    <MobileContainer>
      <div className="h-full bg-[#F8F7F3] overflow-y-auto pb-24">
        <div className="bg-gradient-to-r from-[#0B1220] to-[#059669] px-6 pt-12 pb-6 rounded-b-[30px]">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-white/80 hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-7 h-7 text-[#C9A227]" />
            <h1 className="text-white text-2xl" style={{ fontWeight: 700 }}>
              Community
            </h1>
          </div>
          <p className="text-white/80 text-sm">Connect with other pet parents in Pune.</p>

          <div className="flex gap-2 mt-5">
            {(
              [
                ['feed', 'Feed'],
                ['events', 'Birthdays & events'],
                ['cafes', 'Pet cafés'],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                  tab === k ? 'bg-white text-[#059669]' : 'bg-white/15 text-white/90'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-5">
          {loading ? (
            <p className="text-[#6B7280] text-sm">Loading…</p>
          ) : tab === 'feed' ? (
            <div className="space-y-4">
              <div className="bg-white rounded-[20px] p-4 shadow-sm border border-[#E5E7EB]">
                <label className="text-[#111827] text-sm font-semibold block mb-2">Share with the community</label>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Training wins, vet recommendations, playdate invites…"
                  rows={3}
                  className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
                <button
                  type="button"
                  onClick={submitPost}
                  className="mt-3 w-full py-3 rounded-xl bg-[#059669] text-white text-sm font-semibold"
                >
                  Post
                </button>
              </div>

              {posts.map((p) => (
                <div key={p.id} className="bg-white rounded-[20px] p-4 shadow-sm border border-[#E5E7EB]">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-[#059669]" />
                    <span className="text-xs font-semibold text-[#059669]">{p.author_label}</span>
                    {p.pet_name ? (
                      <span className="text-xs text-[#6B7280]">· {p.pet_name}</span>
                    ) : null}
                  </div>
                  <p className="text-[#111827] text-sm leading-relaxed whitespace-pre-wrap">{p.body}</p>
                  {p.created_at ? <p className="text-[10px] text-[#9CA3AF] mt-2">{p.created_at.slice(0, 16)}</p> : null}
                </div>
              ))}
            </div>
          ) : tab === 'events' ? (
            <div className="space-y-4">
              {events.map((e) => (
                <div key={e.id} className="bg-white rounded-[20px] p-4 shadow-sm border border-[#E5E7EB]">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#059669]/10 flex items-center justify-center shrink-0">
                      {e.type === 'birthday' ? (
                        <Cake className="w-5 h-5 text-[#059669]" />
                      ) : (
                        <Calendar className="w-5 h-5 text-[#059669]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#111827] font-bold text-sm">{e.title}</h3>
                      <p className="text-[#6B7280] text-xs mt-1">{e.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2 text-xs text-[#6B7280]">
                        <span>{e.event_date}</span>
                        {e.time ? <span>· {e.time}</span> : null}
                      </div>
                      {e.location ? (
                        <p className="text-xs text-[#111827] mt-2 flex items-center gap-1">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {e.location}
                        </p>
                      ) : null}
                      {e.lat != null && e.lng != null ? (
                        <a
                          href={googleMapsDirectionsUrl(e.lat, e.lng, e.title)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-xs font-semibold text-[#059669]"
                        >
                          Open in Google Maps
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-[#6B7280] text-xs leading-relaxed">
                Real Pune spots popular with pet parents. Tap Pay to confirm a table booking.
              </p>
              {cafes.map((c) => (
                <div key={c.id} className="bg-white rounded-[20px] p-4 shadow-sm border border-[#E5E7EB]">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#C9A227]/15 flex items-center justify-center shrink-0">
                      <Coffee className="w-5 h-5 text-[#C9A227]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#111827] font-bold">{c.name}</h3>
                      <p className="text-[#6B7280] text-xs">{c.area} · {c.address}</p>
                      <p className="text-[#374151] text-xs mt-2 leading-relaxed">{c.description}</p>
                      <p className="text-[#059669] font-bold text-sm mt-2">₹{c.price_per_visit_paise / 100} / booking</p>
                      <div className="flex gap-2 mt-3">
                        <a
                          href={googleMapsDirectionsUrl(c.lat, c.lng, c.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 text-center text-xs font-semibold rounded-xl bg-[#F3F4F6] text-[#111827]"
                        >
                          Maps
                        </a>
                        <button
                          type="button"
                          onClick={() => payForCafe(c)}
                          className="flex-1 py-2 text-xs font-semibold rounded-xl bg-[#059669] text-white"
                        >
                          Pay
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
      <PetoButton />

      {paymentDoneOpen ? (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/40 px-6">
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cafe-pay-done-title"
          >
            <h2 id="cafe-pay-done-title" className="text-lg text-[#111827] text-center mb-2" style={{ fontWeight: 700 }}>
              Payment done
            </h2>
            <p className="text-sm text-[#6B7280] text-center mb-6">
              {paidCafeName ? `Booking confirmed for ${paidCafeName}.` : 'Your payment is complete.'}
            </p>
            <button
              type="button"
              onClick={() => setPaymentDoneOpen(false)}
              className="w-full py-3 rounded-xl bg-[#059669] text-white text-sm hover:bg-[#047857]"
              style={{ fontWeight: 600 }}
            >
              OK
            </button>
          </div>
        </div>
      ) : null}
    </MobileContainer>
  );
}
