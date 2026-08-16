import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import MobileContainer from '../components/MobileContainer';
import VetsMap from '../components/VetsMap';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ArrowLeft, MapPin, Star, Phone, Navigation } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import type { ApiVet } from '../../lib/vetAdapters';
import { googleMapsDirectionsUrl } from '../../lib/maps';

const PUNE_REF = { lat: 18.5204, lng: 73.8567 };

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * (2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)));
}

type Row = {
  id: number;
  name: string;
  clinic: string;
  distance: string;
  rating: number;
  available: boolean;
  fee: number;
  image: string;
  lat: number;
  lng: number;
  address: string;
};

export default function NearbyVets() {
  const navigate = useNavigate();
  const [vets, setVets] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await apiFetch('/vets');
      const data = await res.json();
      if (!cancelled && res.ok && Array.isArray(data.vets)) {
        setVets(
          (data.vets as ApiVet[]).map((v) => {
            const lat = v.lat ?? PUNE_REF.lat;
            const lng = v.lng ?? PUNE_REF.lng;
            const km = haversineKm(PUNE_REF, { lat, lng });
            return {
              id: v.id,
              name: v.name,
              clinic: v.address || `${v.area ?? v.city ?? 'Pune'} · clinic`,
              distance: `${km.toFixed(1)} km`,
              rating: v.rating,
              available: v.available,
              fee: v.fee,
              image: v.image ?? '',
              lat,
              lng,
              address: v.address || `${v.area ?? ''}, ${v.city ?? 'Pune'}`,
            };
          })
        );
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const mapMarkers = useMemo(
    () =>
      vets.map((v) => ({
        id: v.id,
        name: v.name,
        lat: v.lat,
        lng: v.lng,
        available: v.available,
        area: v.clinic,
      })),
    [vets]
  );

  return (
    <MobileContainer>
      <div className="h-full bg-[#F8F7F3] overflow-y-auto pb-4">
        <div className="bg-gradient-to-r from-[#0B1220] to-[#059669] px-6 pt-12 pb-6 rounded-b-[30px]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white text-2xl flex-1" style={{ fontWeight: 700 }}>
              Nearby Veterinarians
            </h1>
          </div>
          <p className="text-white/80 text-xs mt-3 leading-relaxed">
            OpenStreetMap view · Navigate opens Google Maps with driving directions.
          </p>
        </div>

        <div className="px-6 mt-6">
          {loading ? (
            <div className="h-[220px] bg-[#E5E7EB] rounded-[20px] animate-pulse" />
          ) : (
            <VetsMap vets={mapMarkers} height="240px" />
          )}
        </div>

        <div className="px-6 py-6 space-y-4">
          {loading ? (
            <p className="text-[#6B7280] text-sm">Loading…</p>
          ) : vets.length === 0 ? (
            <div className="bg-white rounded-[20px] p-8 text-center text-[#6B7280] text-sm shadow-sm">
              No vets to show.
            </div>
          ) : (
            vets.map((vet) => (
              <div key={vet.id} className="bg-white rounded-[20px] p-4 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#F3F4F6]">
                    <ImageWithFallback
                      src={vet.image}
                      alt={vet.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#111827] text-base mb-1" style={{ fontWeight: 700 }}>
                      {vet.name}
                    </h3>
                    <p className="text-[#6B7280] text-xs mb-1 line-clamp-2">{vet.clinic}</p>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#C9A227] shrink-0" fill="#C9A227" />
                      <span className="text-[#111827] text-sm" style={{ fontWeight: 600 }}>
                        {vet.rating}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs shrink-0 ${
                      vet.available ? 'bg-[#059669]/10 text-[#059669]' : 'bg-[#6B7280]/10 text-[#6B7280]'
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {vet.available ? 'Available' : 'Offline'}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1 text-[#6B7280] text-sm">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>{vet.distance}</span>
                  </div>
                  <div className="h-4 w-px bg-[#E5E7EB]" />
                  <span className="text-[#111827] text-sm" style={{ fontWeight: 700 }}>
                    ₹{vet.fee}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={googleMapsDirectionsUrl(vet.lat, vet.lng, vet.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 bg-[#059669] text-white rounded-lg text-xs hover:bg-[#047857] transition-colors flex items-center justify-center gap-1 font-semibold text-center"
                  >
                    <Navigation className="w-3 h-3" />
                    Navigate
                  </a>
                  <button
                    type="button"
                    onClick={() => navigate(`/vet/${vet.id}`)}
                    className="py-2 bg-[#F3F4F6] text-[#111827] rounded-lg text-xs hover:bg-[#E5E7EB] transition-colors flex items-center justify-center gap-1 font-semibold"
                  >
                    <Phone className="w-3 h-3" />
                    Profile
                  </button>
                  <button
                    onClick={() => navigate(`/vet/${vet.id}`)}
                    className="py-2 bg-[#0B1220] text-white rounded-lg text-xs hover:bg-[#111827] transition-colors font-semibold"
                  >
                    Consult
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MobileContainer>
  );
}
