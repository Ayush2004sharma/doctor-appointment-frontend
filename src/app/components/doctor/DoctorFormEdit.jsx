'use client';

import { useState, useEffect } from 'react';
import { MapPin, Phone, Save, X } from 'lucide-react';
import api from '@/app/utils/api';

export default function DoctorProfileEditForm({ doctor, onCancel, onSave }) {
  const token = localStorage.getItem('token');
  const [form, setForm] = useState({
    ...doctor,
    coordinates: doctor.location?.coordinates || [0, 0],
  });
  const [geoLoading, setGeoLoading] = useState(false);

  // Auto-get location if missing
  useEffect(() => {
    if (
      (!form.coordinates || form.coordinates.length !== 2 ||
        (form.coordinates[0] === 0 && form.coordinates[1] === 0))
    ) {
      if ('geolocation' in navigator) {
        setGeoLoading(true);
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setForm((prev) => ({
              ...prev,
              coordinates: [longitude, latitude],
            }));
            setGeoLoading(false);
          },
          (err) => {
            console.error('Geolocation error:', err);
            setGeoLoading(false);
          }
        );
      }
    }
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const { coordinates, ...other } = form;
      const payload = {
        ...other,
        location: { type: 'Point', coordinates },
      };
      const res = await api.patch(`/doctors/profile/${doctor._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSave(res.data.updatedDoctor);
    } catch (err) {
      console.error('Error updating doctor:', err);
    }
  };

  return (
    <div className="space-y-3 text-sm text-blue-900">
      {/* Editable fields */}
      <input
        value={form.name}
        onChange={(e) => handleChange('name', e.target.value)}
        className="w-full p-1 border rounded"
        placeholder="Name"
      />
      <textarea
        value={form.bio}
        onChange={(e) => handleChange('bio', e.target.value)}
        className="w-full p-1 border rounded"
        placeholder="Bio"
      />
      <input
        type="number"
        value={form.experience}
        onChange={(e) => handleChange('experience', e.target.value)}
        className="w-full p-1 border rounded"
        placeholder="Experience (yrs)"
      />
      <input
        type="number"
        value={form.fee}
        onChange={(e) => handleChange('fee', e.target.value)}
        className="w-full p-1 border rounded"
        placeholder="Fee"
      />
      <input
        value={form.qualifications?.join(', ')}
        onChange={(e) =>
          handleChange('qualifications', e.target.value.split(',').map((q) => q.trim()))
        }
        className="w-full p-1 border rounded"
        placeholder="Qualifications (comma-separated)"
      />
      <div>
        <strong>Latitude:</strong>{' '}
        {geoLoading ? (
          'Detecting...'
        ) : (
          <input
            type="number"
            step="any"
            value={form.coordinates[1]}
            onChange={(e) =>
              handleChange('coordinates', [form.coordinates[0], parseFloat(e.target.value)])
            }
            className="w-full p-1 border rounded"
          />
        )}
      </div>
      <div>
        <strong>Longitude:</strong>{' '}
        {geoLoading ? (
          'Detecting...'
        ) : (
          <input
            type="number"
            step="any"
            value={form.coordinates[0]}
            onChange={(e) =>
              handleChange('coordinates', [parseFloat(e.target.value), form.coordinates[1]])
            }
            className="w-full p-1 border rounded"
          />
        )}
      </div>
      <p className="flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        <input
          value={form.clinicAddress}
          onChange={(e) => handleChange('clinicAddress', e.target.value)}
          className="w-full p-1 border rounded"
          placeholder="Clinic Address"
        />
      </p>
      <p className="flex items-center gap-2">
        <Phone className="w-4 h-4" />
        <input
          value={form.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className="w-full p-1 border rounded"
          placeholder="Phone"
        />
      </p>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={onCancel}
          className="flex items-center gap-1 px-4 py-2 bg-gray-200 text-gray-800 rounded"
        >
          <X className="w-4 h-4" /> Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded"
          disabled={geoLoading}
        >
          <Save className="w-4 h-4" /> Save
        </button>
      </div>
    </div>
  );
}
