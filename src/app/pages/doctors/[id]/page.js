'use client';

import { useEffect, useState } from 'react';
import api from '@/app/utils/api';
import { use } from 'react';
import { useRouter } from 'next/navigation';

export default function DoctorCard({ params }) {
  const { id } = use(params);
  const router = useRouter(); // router for navigation

  const [doctor, setDoctor] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [doctorError, setDoctorError] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoadingDoctor(true);
      setDoctorError(null);
      try {
        const { data } = await api.get(`/doctors/${id}`);
        if (!data) {
          setDoctorError('Doctor data not found.');
          setDoctor(null);
        } else {
          setDoctor(data);
        }
      } catch (err) {
        console.error('Error fetching doctor:', err);
        setDoctorError('Error fetching doctor info.');
        setDoctor(null);
      } finally {
        setLoadingDoctor(false);
      }
    };

    if (id) fetchDoctor();
  }, [id]);

  if (loadingDoctor) return <div>Loading doctor info...</div>;
  if (doctorError) return <div className="text-red-500">{doctorError}</div>;
  if (!doctor) return <div>Doctor not found.</div>;

  const handleBookAppointment = () => {
    // Navigate to BookAppointments component/page with doctor ID as query param
    router.push(`/pages/book/${id}`);
  };

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-2xl w-full border border-blue-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-blue-800">{doctor.name}</h2>
            <p className="text-blue-600 text-lg">{doctor.specialty}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              doctor.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
            }`}
          >
            {doctor.status}
          </span>
        </div>

        {/* Row: Email & Ratings */}
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <p className="text-blue-500 font-medium">Email: {doctor.email}</p>
          <p className="text-blue-500 font-medium">Ratings: {doctor.ratings}/5</p>
          <p className="text-blue-500 font-medium">Reviews: {doctor.reviews.length}</p>
        </div>

        {/* Row: Qualifications */}
        <div className="mb-4">
          <p className="text-blue-500 font-medium mb-1">Qualifications:</p>
          {doctor.qualifications.length > 0 ? (
            <ul className="list-disc list-inside text-blue-600">
              {doctor.qualifications.map((q, idx) => (
                <li key={idx}>{q}</li>
              ))}
            </ul>
          ) : (
            <p className="text-blue-300">No qualifications listed</p>
          )}
        </div>

        {/* Row: Location & Dates */}
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <div>
            <p className="text-blue-500 font-medium">Location:</p>
            <p className="text-blue-600">
              Coordinates: {doctor.location?.coordinates[0]}, {doctor.location?.coordinates[1]}
            </p>
          </div>
          <div className="text-blue-300 text-sm">
            <p>Created: {new Date(doctor.createdAt).toLocaleDateString()}</p>
            <p>Updated: {new Date(doctor.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Book Appointment Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleBookAppointment}
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl shadow hover:bg-blue-700 transition"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
