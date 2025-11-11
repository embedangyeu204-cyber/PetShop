import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import './Appointments.css';

const formatTimeLabel = (time24) => {
  const [hours, minutes] = time24.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getMonthDays = (date) => {
  const start = dayjs(date).startOf('month');
  const end = dayjs(date).endOf('month');
  const days = [];
  for (let d = start; d.isBefore(end) || d.isSame(end, 'day'); d = d.add(1, 'day')) {
    days.push(d);
  }
  return days;
};

function Appointments() {
  const { user } = useAuth();

  const vetPageSize = 5;
  const appointmentPageSize = 5;

  const today = dayjs().startOf('day');

  const [services, setServices] = useState([]);
  const [pets, setPets] = useState([]);
  const [veterinarians, setVeterinarians] = useState([]);
  const [vetPagination, setVetPagination] = useState({
    page: 1,
    pageSize: vetPageSize,
    totalItems: 0,
    totalPages: 1,
  });
  const [appointments, setAppointments] = useState([]);
  const [appointmentPagination, setAppointmentPagination] = useState({
    page: 1,
    pageSize: appointmentPageSize,
    totalItems: 0,
    totalPages: 1,
  });

  const [vetPage, setVetPage] = useState(1);
  const [appointmentPage, setAppointmentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedVeterinarianId, setSelectedVeterinarianId] = useState(null);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState(null);
  const [vetLoading, setVetLoading] = useState(true);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const loading = vetLoading || appointmentsLoading;

  const loadMetadata = useCallback(
    async (page) => {
      const targetPage = page ?? 1;
      try {
        setVetLoading(true);
        const response = await api.get('/appointments/metadata', {
          params: { vetPage: targetPage, vetPageSize },
        });
        const { services: serviceList, pets: petList, veterinarians: vetPaged } =
          response.data || {};

        if (Array.isArray(serviceList)) {
          setServices(serviceList);
        }
        if (Array.isArray(petList)) {
          setPets(petList);
        }
        if (vetPaged) {
          setVeterinarians(vetPaged.items || []);
          const pagination = vetPaged.pagination || {};
          const totalItems =
            pagination.totalItems ?? vetPaged.items?.length ?? 0;
          const pageSize = pagination.pageSize || vetPageSize;
          setVetPagination({
            page: pagination.page || targetPage,
            pageSize,
            totalItems,
            totalPages: Math.max(1, pagination.totalPages || Math.ceil(totalItems / pageSize)),
          });
        }
      } catch (error) {
        const msg =
          error.response?.data?.message ||
          error.message ||
          'Failed to load booking information.';
        setMessage(msg);
      } finally {
        setVetLoading(false);
      }
    },
    [vetPageSize],
  );

  const loadAppointments = useCallback(
    async (page) => {
      const targetPage = page ?? 1;
      try {
        setAppointmentsLoading(true);
        const response = await api.get('/appointments', {
          params: { page: targetPage, pageSize: appointmentPageSize },
        });
        const { items, pagination } = response.data || {};
        setAppointments(items || []);
        const totalItems = pagination?.totalItems ?? items?.length ?? 0;
        const pageSize = pagination?.pageSize || appointmentPageSize;
        setAppointmentPagination({
          page: pagination?.page || targetPage,
          pageSize,
          totalItems,
          totalPages: Math.max(
            1,
            pagination?.totalPages || Math.ceil(totalItems / pageSize),
          ),
        });
      } catch (error) {
        const msg =
          error.response?.data?.message ||
          error.message ||
          'Unable to load appointments.';
        setMessage(msg);
      } finally {
        setAppointmentsLoading(false);
      }
    },
    [appointmentPageSize],
  );

  useEffect(() => {
    loadMetadata(vetPage);
  }, [vetPage, loadMetadata]);

  useEffect(() => {
    loadAppointments(appointmentPage);
  }, [appointmentPage, loadAppointments]);

  useEffect(() => {
    if (services.length === 0) {
      setSelectedServiceId(null);
      return;
    }
    if (!selectedServiceId || !services.some((service) => service.serviceId === selectedServiceId)) {
      setSelectedServiceId(services[0].serviceId);
    }
  }, [services, selectedServiceId]);

  useEffect(() => {
    if (pets.length === 0) {
      setSelectedPetId(null);
      return;
    }
    if (!selectedPetId || !pets.some((pet) => pet.petId === selectedPetId)) {
      setSelectedPetId(pets[0].petId);
    }
  }, [pets, selectedPetId]);

  useEffect(() => {
    if (veterinarians.length === 0) {
      setSelectedVeterinarianId(null);
      return;
    }
    if (
      !selectedVeterinarianId ||
      !veterinarians.some((vet) => vet.veterinarianId === selectedVeterinarianId)
    ) {
      setSelectedVeterinarianId(veterinarians[0].veterinarianId);
    }
  }, [veterinarians, selectedVeterinarianId]);

  const selectedService = useMemo(
    () =>
      services.find((service) => service.serviceId === selectedServiceId) || null,
    [services, selectedServiceId],
  );

  const selectedVeterinarian = useMemo(
    () =>
      veterinarians.find(
        (vet) => vet.veterinarianId === selectedVeterinarianId,
      ) || null,
    [veterinarians, selectedVeterinarianId],
  );

  const selectedPet = useMemo(
    () => pets.find((pet) => pet.petId === selectedPetId) || null,
    [pets, selectedPetId],
  );

  const monthDays = useMemo(() => getMonthDays(selectedDate), [selectedDate]);

  const handleSelectDay = (day) => {
    setSelectedDate(day);
    setSelectedTime(null);
  };

  useEffect(() => {
    if (!selectedVeterinarianId) {
      setAvailableSlots([]);
      return;
    }

    const controller = new AbortController();
    let mounted = true;

    const fetchSlots = async () => {
      try {
        setSlotsLoading(true);
        const response = await api.get('/appointments/available-slots', {
          params: {
            veterinarianId: selectedVeterinarianId,
            date: selectedDate.format('YYYY-MM-DD'),
            serviceId: selectedServiceId || undefined,
          },
          signal: controller.signal,
        });
        if (mounted) {
          setAvailableSlots(response.data?.slots || []);
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        const msg =
          error.response?.data?.message ||
          error.message ||
          'Unable to load available slots.';
        setMessage(msg);
        if (mounted) {
          setAvailableSlots([]);
        }
      } finally {
        if (mounted) {
          setSlotsLoading(false);
        }
      }
    };

    fetchSlots();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [selectedVeterinarianId, selectedDate, selectedServiceId]);

  useEffect(() => {
    setSelectedTime(null);
  }, [selectedVeterinarianId]);

  useEffect(() => {
    if (selectedTime && !availableSlots.includes(selectedTime)) {
      setSelectedTime(null);
    }
  }, [availableSlots, selectedTime]);

  const handleSubmit = async () => {
    if (!selectedService || !selectedVeterinarianId || !selectedTime) {
      setMessage('Please choose service, veterinarian, date, and time.');
      return;
    }

    try {
      setSubmitting(true);
      setMessage(null);

      const [hour, minute] = selectedTime.split(':').map(Number);
      const start = selectedDate.hour(hour).minute(minute);
      const durationMinutes = selectedService.durationMinutes || 30;
      const end = start.add(durationMinutes, 'minute');

      const payload = {
        serviceId: selectedService.serviceId,
        veterinarianId: selectedVeterinarianId,
        petId: selectedPetId || null,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        notes,
      };

      await api.post('/appointments', payload);
      setMessage('Appointment booked successfully!');
      setNotes('');
      setAppointmentPage(1);
      await loadAppointments(1);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Unable to book appointment.';
      setMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="booking-loading">
        <div className="spinner" />
        <p>Loading booking details...</p>
      </div>
    );
  }

  return (
    <div className="booking-container">
      <header className="booking-header">
        <div>
          <h1>Book service appointments</h1>
          <p>Select pet, service, vet, date &amp; time, then confirm.</p>
        </div>
        <div className="booking-profile">
          <span className="badge">{user?.role || 'Customer'}</span>
          <span>{user?.fullName || user?.email}</span>
        </div>
      </header>

      <div className="booking-content">
        <section className="booking-column details">
          <div className="card">
            <div className="card-header">
              <h2>Appointment details</h2>
              <span className="secure">Secure &amp; private</span>
            </div>
            <div className="card-body">
              <div className="field">
                <label>Select pet</label>
                <div className="pill-group">
                  {pets.length === 0 && (
                    <span className="pill disabled">Add a pet later</span>
                  )}
                  {pets.map((pet) => (
                    <button
                      key={pet.petId}
                      type="button"
                      className={`pill ${pet.petId === selectedPetId ? 'active' : ''}`}
                      onClick={() => setSelectedPetId(pet.petId)}
                    >
                      {pet.name} ({pet.species})
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Select service</label>
                <div className="pill-group">
                  {services.map((service) => (
                    <button
                      key={service.serviceId}
                      type="button"
                      className={`pill ${
                        service.serviceId === selectedServiceId ? 'active' : ''
                      }`}
                      onClick={() => setSelectedServiceId(service.serviceId)}
                    >
                      {service.name}
                    </button>
                  ))}
                </div>
                {selectedService && (
                  <p className="field-meta">
                    Duration: {selectedService.durationMinutes || 30} min · $
                    {selectedService.price.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Select veterinarian</h2>
            </div>
            <div className="card-body vet-list">
              {veterinarians.map((vet) => (
                <button
                  key={vet.veterinarianId}
                  type="button"
                  className={`vet-card ${
                    vet.veterinarianId === selectedVeterinarianId ? 'active' : ''
                  }`}
                  onClick={() => setSelectedVeterinarianId(vet.veterinarianId)}
                >
                  <div className="vet-avatar">
                    <i className="fa-solid fa-user-doctor" />
                  </div>
                  <div>
                    <div className="vet-name">{vet.displayName}</div>
                    <div className="vet-meta">
                      {vet.email || 'No email listed'}
                    </div>
                  </div>
                  <span className="vet-status">
                    {vet.veterinarianId === selectedVeterinarianId
                      ? 'Selected'
                      : 'Available'}
                  </span>
                </button>
              ))}
              <div className="pagination">
                <button
                  type="button"
                  className="pagination-btn"
                  onClick={() => setVetPage((prev) => Math.max(prev - 1, 1))}
                  disabled={vetPage <= 1}
                >
                  <i className="fa-solid fa-chevron-left" />
                </button>
                <span className="pagination-info">
                  Page {vetPagination.page} / {vetPagination.totalPages}
                </span>
                <button
                  type="button"
                  className="pagination-btn"
                  onClick={() =>
                    setVetPage((prev) =>
                      Math.min(prev + 1, vetPagination.totalPages),
                    )
                  }
                  disabled={vetPage >= vetPagination.totalPages}
                >
                  <i className="fa-solid fa-chevron-right" />
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Notes for vet</h2>
              <span className="optional">Optional</span>
            </div>
            <div className="card-body">
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Share any symptoms, preferences, or questions for the veterinarian."
              />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Your upcoming appointments</h2>
            </div>
            <div className="card-body appointment-list">
              {appointments.length === 0 ? (
                <div className="empty-state compact">
                  <i className="fa-solid fa-calendar-days" />
                  <p>No appointments scheduled yet. Pick a time to get started.</p>
                </div>
              ) : (
                appointments.map((item) => (
                  <div key={item.appointmentId} className="appointment-item">
                    <div className="appointment-status">
                      <span
                        className={`status-pill status-${item.status.toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                      <div className="appointment-date">
                        {dayjs(item.startTime).format('DD MMM YYYY')} ·{' '}
                        {dayjs(item.startTime).format('HH:mm')}
                      </div>
                    </div>
                    <div className="appointment-info">
                      <div>
                        <strong>{item.serviceName || 'Service'}</strong>
                        <div className="muted">
                          With {item.veterinarianName || 'veterinarian'} ·{' '}
                          {item.petName || 'No pet selected'}
                        </div>
                      </div>
                      <div className="appointment-meta">
                        ${item.servicePrice?.toFixed(2) ?? '--'}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div className="pagination">
                <button
                  type="button"
                  className="pagination-btn"
                  onClick={() =>
                    setAppointmentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={appointmentPage <= 1}
                >
                  <i className="fa-solid fa-chevron-left" />
                </button>
                <span className="pagination-info">
                  Page {appointmentPagination.page} /{' '}
                  {appointmentPagination.totalPages}
                </span>
                <button
                  type="button"
                  className="pagination-btn"
                  onClick={() =>
                    setAppointmentPage((prev) =>
                      Math.min(prev + 1, appointmentPagination.totalPages),
                    )
                  }
                  disabled={appointmentPage >= appointmentPagination.totalPages}
                >
                  <i className="fa-solid fa-chevron-right" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="booking-column schedule">
          <div className="card">
            <div className="card-header schedule-header">
              <h2>Pick date</h2>
              <span className="badge secondary">
                {selectedDate.format('MMMM YYYY')}
              </span>
            </div>
            <div className="calendar">
              <div className="calendar-grid">
                {monthDays.map((day) => {
                  const isPast = day.isBefore(today);
                  const isActive = day.isSame(selectedDate, 'day');
                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      className={`calendar-day ${
                        isActive ? 'active' : ''
                      } ${isPast ? 'disabled' : ''}`}
                      onClick={() => !isPast && handleSelectDay(day)}
                      disabled={isPast}
                    >
                      {day.date()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Available time slots</h2>
              <span className="optional">
                Times shown for selected veterinarian
              </span>
            </div>
            <div className="card-body slot-grid">
              {!selectedVeterinarianId ? (
                <p className="slot-placeholder">
                  Select a veterinarian to view available times.
                </p>
              ) : slotsLoading ? (
                <p className="slot-placeholder">Loading available slots...</p>
              ) : availableSlots.length === 0 ? (
                <p className="slot-placeholder">
                  No available slots for this date. Try another day.
                </p>
              ) : (
                availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={`slot ${slot === selectedTime ? 'active' : ''}`}
                    onClick={() => setSelectedTime(slot)}
                  >
                    {formatTimeLabel(slot)}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="card summary">
            <div className="card-header">
              <h2>Summary</h2>
            </div>
            <div className="card-body">
              <ul>
                <li>
                  <strong>Pet:</strong> {selectedPet?.name || 'No pet selected'}
                </li>
                <li>
                  <strong>Service:</strong> {selectedService?.name || 'Select service'}
                </li>
                <li>
                  <strong>Veterinarian:</strong>{' '}
                  {selectedVeterinarian?.displayName || 'Select vet'}
                </li>
                <li>
                  <strong>Date &amp; time:</strong>{' '}
                  {selectedTime
                    ? `${selectedDate.format('DD MMM YYYY')} · ${formatTimeLabel(
                        selectedTime,
                      )}`
                    : 'Pick slot'}
                </li>
                <li>
                  <strong>Price:</strong>{' '}
                  {selectedService
                    ? `$${selectedService.price.toFixed(2)}`
                    : '--'}
                </li>
              </ul>
              {message && (
                <div
                  className={`summary-message ${
                    message.includes('success') ? 'success' : 'error'
                  }`}
                >
                  {message}
                </div>
              )}
              <div className="summary-actions">
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => setSelectedTime(null)}
                >
                  Clear selection
                </button>
                <button
                  type="button"
                  className="btn primary"
                  disabled={submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? 'Booking...' : 'Confirm appointment'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Appointments;
