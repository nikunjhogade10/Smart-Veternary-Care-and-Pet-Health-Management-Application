import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import MobileContainer from '../components/MobileContainer';
import { Camera, ArrowRight, ArrowLeft } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { getStoredToken } from '../../lib/session';

export default function AddPet() {
  const navigate = useNavigate();
  const [petName, setPetName] = useState('');
  const [animalType, setAnimalType] = useState('');
  const [customAnimal, setCustomAnimal] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [vaccination, setVaccination] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const animalTypes = ['Dog', 'Cat', 'Bird', 'Others'];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setError('');
    if (!getStoredToken()) {
      navigate('/login', { replace: true });
      return;
    }
    if (!petName.trim()) {
      setError('Please enter your pet’s name');
      return;
    }
    if (!animalType) {
      setError('Select an animal type');
      return;
    }
    const resolvedType =
      animalType === 'Others' ? (customAnimal.trim() || 'Other') : animalType;
    setLoading(true);
    try {
      const res = await apiFetch('/pets', {
        method: 'POST',
        body: JSON.stringify({
          name: petName.trim(),
          animal_type: resolvedType,
          breed: breed.trim() || null,
          age: age === '' ? null : Number(age),
          weight: weight === '' ? null : Number(weight),
          gender: gender || null,
          vaccination_status: vaccination || null,
          date_of_birth: dateOfBirth.trim() || null,
          photo: photo,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(typeof j.detail === 'string' ? j.detail : 'Could not save pet');
        return;
      }
      navigate('/dashboard', { replace: true });
    } catch {
      setError('Network error — is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileContainer>
      <div className="h-full bg-[#F8F7F3] overflow-y-auto">
        <div className="bg-gradient-to-r from-[#0B1220] to-[#059669] px-6 pt-12 relative pb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-white/80 hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-2xl mb-2" style={{ fontWeight: 700 }}>
            Add Your Pet
          </h1>
          <p className="text-white/90 text-sm">Tell us about your furry friend</p>
        </div>

        <div className="px-6 py-6 space-y-5">
          <div className="flex justify-center mb-2">
            <input
              type="file"
              id="pet-photo-input"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <label
              htmlFor="pet-photo-input"
              className="w-32 h-32 bg-white rounded-[20px] border-2 border-dashed border-[#E5E7EB] flex flex-col items-center justify-center gap-2 hover:border-[#059669] transition-colors cursor-pointer overflow-hidden relative"
            >
              {photo ? (
                <img src={photo} alt="Pet Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera className="w-8 h-8 text-[#6B7280]" strokeWidth={2} />
                  <span className="text-[#6B7280] text-sm">Add Photo</span>
                </>
              )}
            </label>
          </div>

          <div>
            <label className="text-[#111827] text-sm mb-2 block" style={{ fontWeight: 600 }}>
              Pet Name
            </label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="e.g., Max, Bella"
              className="w-full px-4 py-3 bg-white rounded-xl border border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-[#111827] text-sm mb-2 block" style={{ fontWeight: 600 }}>
              Animal Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {animalTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAnimalType(type)}
                  className={`py-3 px-4 rounded-xl border-2 transition-all ${
                    animalType === type
                      ? 'border-[#059669] bg-[#059669]/5 text-[#059669]'
                      : 'border-[#E5E7EB] bg-white text-[#6B7280]'
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {animalType === 'Others' && (
            <div>
              <input
                type="text"
                value={customAnimal}
                onChange={(e) => setCustomAnimal(e.target.value)}
                placeholder="Enter animal type"
                className="w-full px-4 py-3 bg-white rounded-xl border border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent"
              />
            </div>
          )}

          <div>
            <label className="text-[#111827] text-sm mb-2 block" style={{ fontWeight: 600 }}>
              Breed
            </label>
            <input
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="e.g., Golden Retriever"
              className="w-full px-4 py-3 bg-white rounded-xl border border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#111827] text-sm mb-2 block" style={{ fontWeight: 600 }}>
                Age (years)
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="3"
                className="w-full px-4 py-3 bg-white rounded-xl border border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-[#111827] text-sm mb-2 block" style={{ fontWeight: 600 }}>
                Weight (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="25"
                className="w-full px-4 py-3 bg-white rounded-xl border border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="text-[#111827] text-sm mb-2 block" style={{ fontWeight: 600 }}>
              Gender
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Male', 'Female'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-3 px-4 rounded-xl border-2 transition-all ${
                    gender === g
                      ? 'border-[#059669] bg-[#059669]/5 text-[#059669]'
                      : 'border-[#E5E7EB] bg-white text-[#6B7280]'
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[#111827] text-sm mb-2 block" style={{ fontWeight: 600 }}>
              Birthday (optional)
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-xl border border-[#E5E7EB] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent"
            />
            <p className="text-[#9CA3AF] text-xs mt-1">Used for birthday reminders in Community.</p>
          </div>

          <div>
            <label className="text-[#111827] text-sm mb-2 block" style={{ fontWeight: 600 }}>
              Vaccination Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Up to date', 'Pending'].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVaccination(v)}
                  className={`py-3 px-4 rounded-xl border-2 transition-all ${
                    vaccination === v
                      ? 'border-[#059669] bg-[#059669]/5 text-[#059669]'
                      : 'border-[#E5E7EB] bg-white text-[#6B7280]'
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {error ? <p className="text-red-600 text-sm">{error}</p> : null}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-4 bg-[#059669] text-white py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#047857] transition-colors shadow-lg disabled:opacity-60"
            style={{ fontWeight: 600 }}
          >
            {loading ? 'Saving…' : 'Continue to Dashboard'}
            {!loading ? <ArrowRight className="w-5 h-5" /> : null}
          </button>

          <div className="pb-6"></div>
        </div>
      </div>
    </MobileContainer>
  );
}
