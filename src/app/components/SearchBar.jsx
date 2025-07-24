'use client';

import React from 'react';

const SPECIALTIES = [
  'All',
  'Cardiology',
  'Dermatology',
  'Orthopedics',
  'Pediatrics',
  'ENT',
  'Dentist',
  'Neurology',
  'Psychiatry',
];

export default function DoctorSearchBar({ query, setQuery, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-8">
        🩺 Find a Doctor Near You
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-4 sm:gap-6 items-stretch justify-center"
      >
        {/* Specialty */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specialty
          </label>
          <select
            value={query.specialty}
            onChange={(e) => setQuery((q) => ({ ...q, specialty: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-base bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SPECIALTIES.map((s) => (
              <option key={s} value={s === 'All' ? '' : s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Delhi"
            value={query.city}
            onChange={(e) => setQuery((q) => ({ ...q, city: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-base bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-2.5 rounded-lg text-base font-semibold shadow-md transition w-full md:w-auto"
          >
            🔍 Search
          </button>
        </div>
      </form>
    </div>
  );
}
