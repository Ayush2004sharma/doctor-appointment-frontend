'use client';

import { useEffect, useState } from 'react';
import api from '@/app/utils/api';
import { useParams } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function BookAppointments() {
  const params = useParams();
  const doctorId = params.id;
  console.log("Doctor ID:", doctorId);
  const {user}= useAuthContext();
  const loggedInUser=user.userId||null;
  console.log("Logged in user:", loggedInUser);
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const router = useRouter();

const [notes, setNotes] = useState(""); // state for notes
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [doctorError, setDoctorError] = useState(null);
  const [slotsError, setSlotsError] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);

  // Map JS day index to API key
  const dayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  // Fetch doctor info
  useEffect(() => {
    const fetchDoctor = async () => {
      setLoadingDoctor(true);
      setDoctorError(null);
      try {
        const { data } = await api.get(`/doctors/${doctorId}`);
        if (!data) setDoctorError('Doctor not found.');
        else setDoctor(data);
      } catch (err) {
        console.error(err);
        setDoctorError('Error fetching doctor info.');
      } finally {
        setLoadingDoctor(false);
      }
    };
    if (doctorId) fetchDoctor();
  }, [doctorId]);

  // Fetch available slots for selected date
useEffect(() => {
  const fetchSlots = async () => {
    setLoadingSlots(true);
    setSlotsError(null);
    setAvailableSlots([]);
    console.log('Fetching slots for:', doctorId);

    try {
      const token = localStorage.getItem('token'); // or wherever you store it
   const { data } = await api.get('/doctors/availability', {
  params: { doctorId },
  headers: { Authorization: `Bearer ${token}` }
});


      const dayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      const dayKey = dayMap[new Date(selectedDate).getDay()];

      const daySchedule = data.schedule.schedule[dayKey];

      if (!daySchedule || !daySchedule.active || daySchedule.slots.length === 0) {
        setAvailableSlots([]);
      } else {
        const slots = daySchedule.slots.map(
          (s) => `${s.startTime} - ${s.endTime}`
        );
        setAvailableSlots(slots);
      }
    } catch (err) {
      console.error(err);
      setSlotsError('Error fetching available slots.');
    } finally {
      setLoadingSlots(false);
    }
  };

  if (doctorId && selectedDate) fetchSlots();
}, [doctorId, selectedDate]);


  // Book appointment
const handleBooking = async () => {
  if (!selectedSlot) return alert('Please select a slot');
  if (!loggedInUser) return alert("You must be logged in to book an appointment");

  const startTime = selectedSlot.split(' - ')[0];
  const scheduledFor = new Date(`${selectedDate}T${startTime}:00`).toISOString();

  if (isNaN(new Date(scheduledFor).getTime())) {
    return alert("Invalid date or time selected");
  }

  const payload = {
    userId: loggedInUser,
    scheduledFor,
    notes
  };

  try {
    const token = localStorage.getItem("token");
    await api.post(`/appointments/${doctorId}`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setBookingStatus('Appointment booked successfully!');

    // Redirect after 1 second
    setTimeout(() => {
      router.push('/'); // go to home page
    }, 1000);

  } catch (err) {
    console.error(err.response?.data || err);
    setBookingStatus('Failed to book appointment.');
  }
};



  if (loadingDoctor) return <div>Loading doctor info...</div>;
  if (doctorError) return <div className="text-red-500">{doctorError}</div>;

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-2xl w-full border border-blue-200">
        {/* Doctor Info */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-blue-800">{doctor.name}</h2>
          <p className="text-blue-600 text-lg">{doctor.specialty}</p>
          <p className="text-blue-500 mt-1">Email: {doctor.email}</p>
        </div>

        {/* Date Picker */}
        <div className="mb-4">
          <label className="text-blue-600 font-medium mb-1 block">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
<div className="mb-4">
  <label className="text-blue-600 font-medium mb-1 block">Notes (optional):</label>
  <textarea
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
    placeholder="Enter any notes for your appointment..."
    className="border rounded px-2 py-1 w-full"
    rows={3}
  />
</div>
        {/* Available Slots */}
        <div className="mb-4">
          <p className="text-blue-600 font-medium mb-2">Available Slots:</p>
          {loadingSlots ? (
            <p>Loading slots...</p>
          ) : slotsError ? (
            <p className="text-red-500">{slotsError}</p>
          ) : availableSlots.length === 0 ? (
            <p className="text-red-500">No slots available for this date.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availableSlots.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-4 py-2 rounded text-white font-medium transition ${
                    selectedSlot === slot ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Book Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleBooking}
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl shadow hover:bg-blue-700 transition"
          >
            Confirm Appointment
          </button>
        </div>

        {/* Booking Status */}
        {bookingStatus && (
          <p className="mt-4 text-center font-medium text-green-600">{bookingStatus}</p>
        )}
      </div>
    </div>
  );
}
