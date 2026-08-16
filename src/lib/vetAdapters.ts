export type ApiVet = {
  id: number;
  name: string;
  specialization: string;
  rating: number;
  fee: number;
  available: boolean;
  city?: string;
  area?: string;
  address?: string;
  lat?: number;
  lng?: number;
  image?: string;
};

export type ConsultationVet = ApiVet & {
  reviews: number;
  experience: string;
  homeVisitAvailable: boolean;
  homeVisitFee: number;
  estimatedArrival: string | null;
  emergency: boolean;
  nextSlot: string;
};

export function toConsultationVet(v: ApiVet): ConsultationVet {
  const emergency = v.specialization.toLowerCase().includes('emergency');
  return {
    ...v,
    image: v.image ?? '',
    reviews: Math.round((v.rating || 4.5) * 40),
    experience: '—',
    homeVisitAvailable: v.available && !emergency,
    homeVisitFee: (v.fee || 0) + 250,
    estimatedArrival: v.available ? '~45 mins' : null,
    emergency,
    nextSlot: v.available ? 'Book a slot' : 'Unavailable',
  };
}

export function vetMatchesSpec(v: ConsultationVet, spec: string): boolean {
  if (spec === 'All') return true;
  const s = v.specialization.toLowerCase();
  if (spec === 'General') return s.includes('general');
  if (spec === 'Surgery') return s.includes('surgery');
  if (spec === 'Dental') return s.includes('dental');
  if (spec === 'Nutrition') return s.includes('nutrition');
  if (spec === 'Emergency') return s.includes('emergency') || s.includes('critical');
  if (spec === 'Exotics') return s.includes('avian') || s.includes('exotic');
  return true;
}
