import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import MobileContainer from '../components/MobileContainer';
import { ArrowLeft, Bell, Syringe, Pill, Calendar, CheckCircle, Plus, X } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { getStoredToken } from '../../lib/session';

type Pet = { id: number; name: string };
type ReminderRow = {
  id: number;
  pet_id: number;
  title: string;
  description: string | null;
  due_date: string;
  status: string;
};

function iconForTitle(title: string) {
  const t = title.toLowerCase();
  if (t.includes('vaccin') || t.includes('rabies')) return Syringe;
  if (t.includes('deworm') || t.includes('medicine') || t.includes('dose')) return Pill;
  if (t.includes('follow') || t.includes('check')) return Calendar;
  return Bell;
}

function colorForTitle(title: string) {
  const t = title.toLowerCase();
  if (t.includes('vaccin') || t.includes('rabies')) return '#059669';
  if (t.includes('deworm') || t.includes('medicine')) return '#C9A227';
  return '#0B1220';
}

export default function Reminders() {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState<ReminderRow[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [petsById, setPetsById] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [formPetId, setFormPetId] = useState<number | ''>('');
  const [formTitle, setFormTitle] = useState('');
  const [formDue, setFormDue] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState('');

  const load = async () => {
    const [pr, rr] = await Promise.all([apiFetch('/pets'), apiFetch('/reminders')]);
    const pj = await pr.json();
    const rj = await rr.json();
    if (pr.ok && Array.isArray(pj.pets)) {
      setPets(pj.pets);
      const m: Record<number, string> = {};
      for (const p of pj.pets) m[p.id] = p.name;
      setPetsById(m);
      if (pj.pets.length && formPetId === '') setFormPetId(pj.pets[0].id);
    }
    if (rr.ok && Array.isArray(rj.reminders)) setReminders(rj.reminders);
  };

  useEffect(() => {
    if (!getStoredToken()) {
      navigate('/login', { replace: true });
      return;
    }
    let cancelled = false;
    (async () => {
      await load();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const markComplete = async (id: number) => {
    const res = await apiFetch(`/reminders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'completed' }),
    });
    if (!res.ok) return;
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'completed' } : r)));
  };

  const sorted = useMemo(
    () =>
      [...reminders].sort((a, b) => {
        if (a.status === b.status) return a.id - b.id;
        return a.status === 'pending' ? -1 : 1;
      }),
    [reminders]
  );

  const saveReminder = async () => {
    setFormErr('');
    if (formPetId === '') {
      setFormErr('Add a pet first (Profile → Pets).');
      return;
    }
    if (!formTitle.trim()) {
      setFormErr('Enter a title');
      return;
    }
    if (!formDue.trim()) {
      setFormErr('Pick a due date');
      return;
    }
    setSaving(true);
    try {
      const res = await apiFetch('/reminders', {
        method: 'POST',
        body: JSON.stringify({
          pet_id: formPetId,
          title: formTitle.trim(),
          due_date: formDue.trim(),
          description: formDesc.trim() || null,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setFormErr(typeof j.detail === 'string' ? j.detail : 'Could not save');
        return;
      }
      const row = await res.json();
      setReminders((prev) => [...prev, row]);
      setFormTitle('');
      setFormDue('');
      setFormDesc('');
      setSheetOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <MobileContainer>
      <div className="h-full min-h-0 flex flex-col bg-[#F8F7F3] relative overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto pb-8">
        <div className="bg-gradient-to-r from-[#0B1220] to-[#059669] px-6 pt-12 pb-6 rounded-b-[30px]">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white text-2xl flex-1" style={{ fontWeight: 700 }}>
              Reminders
            </h1>
            <button
              type="button"
              onClick={() => {
                setFormErr('');
                setSheetOpen(true);
              }}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            >
              <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
            </button>
            <Bell className="w-6 h-6 text-white" />
          </div>
          <p className="text-white/80 text-xs leading-relaxed">
            Tap + to add vaccines, grooming, or any date you want to remember.
          </p>
        </div>

        <div className="px-6 py-6 space-y-4">
          {loading ? (
            <p className="text-[#6B7280] text-sm">Loading…</p>
          ) : sorted.length === 0 ? (
            <div className="bg-white rounded-[20px] p-8 text-center shadow-sm">
              <p className="text-[#6B7280] text-sm mb-3">No reminders yet.</p>
              <p className="text-[#9CA3AF] text-xs mb-4">Add check-ups, medicines, or birthdays manually.</p>
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="px-5 py-3 rounded-xl bg-[#059669] text-white text-sm font-semibold inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add reminder
              </button>
            </div>
          ) : (
            sorted.map((reminder) => {
              const Icon = iconForTitle(reminder.title);
              const color = colorForTitle(reminder.title);
              const petName = petsById[reminder.pet_id] || 'Pet';
              const isDone = reminder.status === 'completed';
              return (
                <div
                  key={reminder.id}
                  className={`bg-white rounded-[20px] p-5 shadow-sm ${isDone ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color }} strokeWidth={2} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-[#111827] text-base mb-1" style={{ fontWeight: 700 }}>
                            {reminder.title}
                          </h3>
                          <p className="text-[#6B7280] text-sm">{petName}</p>
                        </div>
                        {isDone && <CheckCircle className="w-5 h-5 text-[#059669]" fill="#059669" />}
                      </div>

                      <div className="flex items-center gap-3 text-[#6B7280] text-sm">
                        <span>{reminder.due_date}</span>
                      </div>

                      {!isDone && (
                        <button
                          type="button"
                          onClick={() => markComplete(reminder.id)}
                          className="mt-3 text-[#059669] text-sm"
                          style={{ fontWeight: 600 }}
                        >
                          Mark as Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        </div>

        {sheetOpen && (
          <div
            className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="flex-1 min-h-[80px]"
              aria-label="Close"
              onClick={() => setSheetOpen(false)}
            />
            <div className="bg-white rounded-t-[24px] px-5 pt-4 pb-8 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#111827]">New reminder</h2>
                <button type="button" onClick={() => setSheetOpen(false)} className="p-2 rounded-full hover:bg-[#F3F4F6]">
                  <X className="w-5 h-5 text-[#6B7280]" />
                </button>
              </div>

              {pets.length === 0 ? (
                <p className="text-sm text-[#6B7280] mb-4">Add a pet first, then you can attach reminders.</p>
              ) : (
                <>
                  <label className="text-xs font-semibold text-[#6B7280] block mb-1">Pet</label>
                  <select
                    value={formPetId === '' ? '' : String(formPetId)}
                    onChange={(e) => setFormPetId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full mb-3 rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm"
                  >
                    {pets.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  <label className="text-xs font-semibold text-[#6B7280] block mb-1">Title</label>
                  <input
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Rabies booster"
                    className="w-full mb-3 rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm"
                  />

                  <label className="text-xs font-semibold text-[#6B7280] block mb-1">Due date</label>
                  <input
                    type="date"
                    value={formDue}
                    onChange={(e) => setFormDue(e.target.value)}
                    className="w-full mb-3 rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm"
                  />

                  <label className="text-xs font-semibold text-[#6B7280] block mb-1">Notes (optional)</label>
                  <textarea
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    rows={2}
                    className="w-full mb-3 rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm"
                  />
                </>
              )}

              {formErr ? <p className="text-red-600 text-xs mb-2">{formErr}</p> : null}

              <button
                type="button"
                disabled={saving || pets.length === 0}
                onClick={saveReminder}
                className="w-full py-3.5 rounded-xl bg-[#059669] text-white font-semibold text-sm disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save reminder'}
              </button>
            </div>
          </div>
        )}
      </div>
    </MobileContainer>
  );
}
