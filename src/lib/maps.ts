export function googleMapsDirectionsUrl(lat: number, lng: number, label?: string): string {
  const q = label ? encodeURIComponent(`${label}`) : `${lat},${lng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
}

export function googleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
