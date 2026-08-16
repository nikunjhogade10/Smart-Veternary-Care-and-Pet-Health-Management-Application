import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export type MapVet = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  available?: boolean;
  area?: string;
};

type Props = {
  vets: MapVet[];
  height?: string;
};

export default function VetsMap({ vets, height = '220px' }: Props) {
  const center = useMemo(() => {
    if (!vets.length) return { lat: 18.54, lng: 73.88 };
    const lat = vets.reduce((s, v) => s + v.lat, 0) / vets.length;
    const lng = vets.reduce((s, v) => s + v.lng, 0) / vets.length;
    return { lat, lng };
  }, [vets]);

  const valid = vets.filter((v) => typeof v.lat === 'number' && typeof v.lng === 'number');

  return (
    <div className="rounded-[20px] overflow-hidden border border-[#E5E7EB] shadow-sm" style={{ height }}>
      <MapContainer center={[center.lat, center.lng]} zoom={12} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {valid.map((v) => (
          <Marker key={v.id} position={[v.lat, v.lng]} icon={DefaultIcon}>
            <Popup>
              <div className="text-sm font-semibold text-[#111827]">{v.name}</div>
              {v.area ? <div className="text-xs text-[#6B7280]">{v.area}</div> : null}
              {v.available === false ? <div className="text-xs text-amber-700 mt-1">Currently offline</div> : null}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
