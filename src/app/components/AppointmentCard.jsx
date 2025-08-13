'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Stethoscope, ClipboardList, XCircle } from 'lucide-react';

export default function AppointmentCard({ appointment, onCancel }) {
  const date = new Date(appointment.scheduledFor);
  const formattedDate = date.toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-md rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">{appointment.doctor.name}</h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              appointment.status === 'booked'
                ? 'bg-green-100 text-green-700'
                : appointment.status === 'cancelled'
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {appointment.status}
          </span>
        </div>

        <p className="text-sm text-gray-500 flex items-center mt-1">
          <Stethoscope className="w-4 h-4 mr-1 text-gray-400" />
          {appointment.doctor.specialty}
        </p>

        <div className="flex items-center text-sm text-gray-600 mt-3">
          <CalendarDays className="w-4 h-4 mr-1 text-gray-400" />
          {formattedDate} — {formattedTime}
        </div>

        {appointment.notes && (
          <p className="text-gray-700 text-sm mt-3 flex items-start">
            <ClipboardList className="w-4 h-4 mt-0.5 mr-2 text-gray-400" />
            {appointment.notes}
          </p>
        )}
      </div>

      {appointment.status === 'booked' && (
        <button
          onClick={() => onCancel(appointment._id)}
          className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <XCircle className="w-4 h-4" />
          Cancel Appointment
        </button>
      )}
    </motion.div>
  );
}
