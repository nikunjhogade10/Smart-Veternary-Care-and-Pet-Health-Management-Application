import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import MobileContainer from '../components/MobileContainer';
import BottomNav from '../components/BottomNav';
import PetoButton from '../components/PetoButton';
import { FileText, Syringe, Pill, Video, Download, ArrowLeft } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { getStoredToken } from '../../lib/session';

type Pet = { id: number; name: string };
type RecordRow = {
  id: number;
  pet_id: number;
  record_type: string;
  title: string;
  description: string | null;
  record_date: string;
};

function iconForType(t: string) {
  const x = t.toLowerCase();
  if (x.includes('vaccin')) return Syringe;
  if (x.includes('prescrip') || x.includes('medic')) return Pill;
  if (x.includes('consult') || x.includes('video')) return Video;
  return FileText;
}

function colorForType(t: string) {
  const x = t.toLowerCase();
  if (x.includes('vaccin')) return '#059669';
  if (x.includes('prescrip') || x.includes('medic')) return '#C9A227';
  if (x.includes('consult') || x.includes('video')) return '#0B1220';
  return '#059669';
}

export default function Records() {
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [records, setRecords] = useState<RecordRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getStoredToken()) {
      navigate('/login', { replace: true });
      return;
    }
    let cancelled = false;
    (async () => {
      const pr = await apiFetch('/pets');
      const pj = await pr.json();
      if (!cancelled && pr.ok && Array.isArray(pj.pets)) {
        setPets(pj.pets);
        if (pj.pets.length) {
          setSelectedPetId((prev) => prev ?? pj.pets[0].id);
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  useEffect(() => {
    if (selectedPetId == null) return;
    let cancelled = false;
    (async () => {
      const res = await apiFetch(`/health-records?pet_id=${selectedPetId}`);
      const data = await res.json();
      if (!cancelled && res.ok && Array.isArray(data.records)) setRecords(data.records);
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedPetId]);

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
            Health Records
          </h1>

          {pets.length > 0 ? (
            <div className="flex gap-3 flex-wrap">
              {pets.map((pet) => (
                <button
                  key={pet.id}
                  onClick={() => setSelectedPetId(pet.id)}
                  className={`px-6 py-2.5 rounded-xl transition-all ${
                    selectedPetId === pet.id
                      ? 'bg-white text-[#059669]'
                      : 'bg-white/20 text-white backdrop-blur-sm'
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  {pet.name}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-white/80 text-sm">Add a pet to start health records.</p>
          )}
        </div>

        <div className="px-6 py-6">
          {loading ? (
            <p className="text-[#6B7280] text-sm">Loading…</p>
          ) : pets.length === 0 ? (
            <div className="bg-white rounded-[20px] p-8 text-center shadow-sm">
              <p className="text-[#6B7280] mb-4">No pets yet.</p>
              <button
                onClick={() => navigate('/add-pet')}
                className="text-[#059669] font-semibold text-sm"
              >
                Add your pet
              </button>
            </div>
          ) : records.length === 0 ? (
            <div className="bg-white rounded-[20px] p-8 text-center shadow-sm">
              <FileText className="w-10 h-10 text-[#9CA3AF] mx-auto mb-2" />
              <p className="text-[#6B7280] text-sm">No records for this pet yet.</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-[#E5E7EB]"></div>
              <div className="space-y-6">
                {records.map((record) => {
                  const Icon = iconForType(record.record_type);
                  const color = colorForType(record.record_type);
                  return (
                    <div key={record.id} className="relative pl-12">
                      <div
                        className="absolute left-0 top-1 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: `${color}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color }} strokeWidth={2} />
                      </div>

                      <div className="bg-white rounded-[20px] p-4 shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-[#6B7280] text-xs mb-1">{record.record_date}</p>
                            <h3 className="text-[#111827] text-base mb-1" style={{ fontWeight: 700 }}>
                              {record.title}
                            </h3>
                            <p className="text-[#6B7280] text-sm">Your care team</p>
                          </div>
                          <span
                            className="px-3 py-1 rounded-full text-xs"
                            style={{
                              backgroundColor: `${color}15`,
                              color,
                              fontWeight: 600,
                            }}
                          >
                            {record.record_type}
                          </span>
                        </div>

                        <div className="h-px bg-[#E5E7EB] my-3"></div>

                        <p className="text-[#6B7280] text-sm mb-3">
                          {record.description || 'No additional notes.'}
                        </p>

                        <button
                          type="button"
                          className="flex items-center gap-2 text-[#059669] text-sm hover:text-[#047857] transition-colors"
                          style={{ fontWeight: 600 }}
                        >
                          <Download className="w-4 h-4" />
                          Download Report
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
      <PetoButton />
    </MobileContainer>
  );
}
