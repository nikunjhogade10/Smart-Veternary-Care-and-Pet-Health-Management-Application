import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import MobileContainer from '../components/MobileContainer';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { getStoredToken } from '../../lib/session';

export default function VideoCall() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const emergency = searchParams.get('emergency') === 'true';
  const [vetName, setVetName] = useState('Veterinarian');
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<'daily' | 'jitsi' | null>(null);

  useEffect(() => {
    if (!getStoredToken()) {
      navigate('/login', { replace: true });
      return;
    }
    let cancelled = false;
    (async () => {
      const vid = id ? parseInt(id, 10) : NaN;
      let name = 'Veterinarian';
      if (!Number.isNaN(vid)) {
        const vr = await apiFetch('/vets');
        const vj = await vr.json();
        const v = Array.isArray(vj.vets) ? vj.vets.find((x: { id: number }) => x.id === vid) : null;
        if (v?.name) name = v.name;
      }
      if (cancelled) return;
      setVetName(name);

      const res = await apiFetch('/video/daily-room', {
        method: 'POST',
        body: JSON.stringify({ vet_id: Number.isNaN(vid) ? null : vid, vet_name: name }),
      });
      const data = await res.json();
      if (cancelled) return;
      if (!res.ok) {
        setError(typeof data.detail === 'string' ? data.detail : 'Could not start video room');
        return;
      }
      setProvider(data.provider === 'jitsi' ? 'jitsi' : 'daily');
      setIframeUrl(data.iframe_url || data.join_url || data.room_url);
    })();
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  return (
    <MobileContainer>
      <div className="h-full bg-[#0B1220] flex flex-col">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 shrink-0 z-20">
          <button type="button" onClick={() => navigate(-1)} className="text-white p-2 rounded-full hover:bg-white/10">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{vetName}</p>
            <p className="text-white/60 text-xs">
              {emergency
                ? provider === 'jitsi'
                  ? 'Emergency video'
                  : 'Emergency video · Daily.co'
                : provider === 'jitsi'
                  ? 'Video consult (instant room)'
                  : 'Video consult · Daily.co'}
            </p>
          </div>
        </div>

        <div className="flex-1 relative min-h-0">
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <p className="text-white/90 text-sm mb-4">{error}</p>
              <p className="text-white/50 text-xs mb-6">
                Check your connection. For Daily.co, add DAILY_API_KEY in pet_health_backend/.env.
              </p>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-semibold"
              >
                Go back
              </button>
            </div>
          ) : !iframeUrl ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/80">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-sm">Starting secure room…</span>
            </div>
          ) : (
            <iframe
              title="Daily video"
              src={iframeUrl}
              className="absolute inset-0 w-full h-full border-0 bg-black"
              allow="camera; microphone; fullscreen; display-capture"
            />
          )}
        </div>
      </div>
    </MobileContainer>
  );
}
