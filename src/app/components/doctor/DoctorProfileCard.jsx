'use client';

import { useEffect, useState } from 'react';
import { Edit } from 'lucide-react';
import { useAuthContext } from '@/app/context/AuthContext';
import api from '@/app/utils/api';
import doc1 from '@/app/assets/assets_frontend/doc1.png';
import Image from 'next/image';
import DoctorProfileEditForm from './DoctorFormEdit';

export default function DoctorProfileCard() {
  const { user, role, loading: authLoading } = useAuthContext();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Fetch doctor profile
  useEffect(() => {
    const fetchDoctor = async () => {
      if (!user?.doctorId || role !== 'doctor') return;
      setLoading(true);
      try {
        const res = await api.get(`/doctors/${user.doctorId}`);
        setDoctor(res.data);
      } catch (err) {
        console.error('Failed to load doctor:', err);
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) fetchDoctor();
  }, [authLoading, user?.doctorId, role]);

  if (authLoading || loading) return <div>Loading profile...</div>;
  if (!doctor) return <div className="text-red-500">Doctor profile not found.</div>;

  return (
    <div className="rounded-2xl p-6 w-full max-w-xl bg-white border border-blue-100 shadow-lg space-y-4">
      {!editMode ? (
        <>
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <Image
              src={doctor.profilePic || doc1}
              alt={doctor.name}
              width={80}
              height={80}
              className="rounded-full object-cover border-2 border-blue-400 shadow-sm"
            />
            <div>
              <h2 className="text-xl font-bold text-blue-900">{doctor.name}</h2>
              <p className="text-sm text-blue-700">{doctor.specialty}</p>
              <p
                className={`text-xs font-semibold ${
                  doctor.status === 'available'
                    ? 'text-green-600'
                    : doctor.status === 'busy'
                    ? 'text-yellow-600'
                    : 'text-red-500'
                }`}
              >
                {doctor.status?.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Details */}
          <p><strong>Bio:</strong> <span className="italic">{doctor.bio || 'N/A'}</span></p>
          <p><strong>Experience:</strong> {doctor.experience} yrs</p>
          <p><strong>Fee:</strong> ₹{doctor.fee}</p>
          <p><strong>Qualifications:</strong> {doctor.qualifications?.join(', ')}</p>
          <p><strong>Latitude:</strong> {doctor.location?.coordinates[1] ?? 'N/A'}</p>
          <p><strong>Longitude:</strong> {doctor.location?.coordinates[0] ?? 'N/A'}</p>
          <p><strong>Clinic Address:</strong> {doctor.clinicAddress}</p>
          <p><strong>Phone:</strong> {doctor.phone}</p>

          {/* Edit Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
            >
              <Edit className="w-4 h-4" /> Edit
            </button>
          </div>
        </>
      ) : (
        <DoctorProfileEditForm
          doctor={doctor}
          onCancel={() => setEditMode(false)}
          onSave={(updatedDoctor) => {
            setDoctor(updatedDoctor);
            setEditMode(false);
          }}
        />
      )}
    </div>
  );
}
