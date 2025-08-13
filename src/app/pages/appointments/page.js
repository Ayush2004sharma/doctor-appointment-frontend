'use client';

import { useEffect, useState } from 'react';
import AppointmentCard from '@/app/components/AppointmentCard';
import api from '@/app/utils/api';
import { useAuthContext } from '@/app/context/AuthContext';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const { user } = useAuthContext();
  const userId = user.userId;

  useEffect(() => {
    api
      .get(`/appointments/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => {
        setAppointments(res.data.appointments || []);
      })
      .catch((err) => console.error('Error fetching appointments:', err));
  }, [userId]);

  const handleCancel = async (appointmentId) => {
    try {
      await api.patch(`/appointments/${appointmentId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setAppointments((prev) =>
        prev.map((app) =>
          app._id === appointmentId ? { ...app, status: 'cancelled' } : app
        )
      );
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  return (
    <div className="p-4 sm:p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {appointments.length > 0 ? (
        appointments.map((app) => (
          <AppointmentCard
            key={app._id}
            appointment={app}
            onCancel={handleCancel}
          />
        ))
      ) : (
        <p className="text-gray-500 col-span-full text-center">
          No appointments found.
        </p>
      )}
    </div>
  );
}
