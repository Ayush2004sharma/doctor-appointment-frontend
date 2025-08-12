'use client';

import React from 'react';

export default function DoctorSearchBar({ query, setQuery }) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-8">
        🩺 Find a Doctor Near You
      </h1>

      <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-4 sm:gap-6 items-stretch justify-center">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Doctor / City / Specialty
          </label>
          <input
            type="text"
            placeholder="e.g. Delhi or Cardiology"
            value={query.keyword ?? ''} // ✅ prevents undefined
            onChange={(e) =>
              setQuery((q) => ({ ...q, keyword: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-base bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
