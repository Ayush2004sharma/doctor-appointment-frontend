'use client';

import { useEffect, useState } from 'react';
import DoctorCard from '@/app/components/doctor/DoctorCard';
import api from '@/app/utils/api';
import DoctorSearchBar from '@/app/components/SearchBar';

export default function DoctorListPage() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [query, setQuery] = useState({ keyword: '' }); // ✅ initialized

  // Fetch all doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get('/doctors/all');
        const data = res.data || [];
        setDoctors(data);
        setFilteredDoctors(data);
      } catch (err) {
        console.error('Failed to fetch doctors', err);
      }
    };
    fetchDoctors();
  }, []);

  // ✅ Instant filtering while typing
  useEffect(() => {
    const keyword = query.keyword.trim().toLowerCase();
    if (!keyword) {
      setFilteredDoctors(doctors);
      return;
    }

    const results = doctors.filter(
      (doc) =>
        doc.name?.toLowerCase().includes(keyword) ||
        doc.specialty?.toLowerCase().includes(keyword) ||
        doc.city?.toLowerCase().includes(keyword)
    );
    setFilteredDoctors(results);
  }, [query.keyword, doctors]); // Runs every time keyword changes

  return (
    <div className="p-6">
      <DoctorSearchBar query={query} setQuery={setQuery} />

      <h1 className="text-2xl font-bold mb-4">Find Your Doctor</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc) => (
            <DoctorCard key={doc._id} doctor={doc} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No doctors found.</p>
        )}
      </div>
    </div>
  );
}
