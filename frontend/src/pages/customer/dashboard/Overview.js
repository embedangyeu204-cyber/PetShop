import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import api from '../../../services/api';
import './Overview.css';

const PET_PAGE_SIZE = 3;

function Overview() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Jane';

  const [pets, setPets] = useState([]);
  const [petPage, setPetPage] = useState(1);

  const [appointments, setAppointments] = useState([]);
  const [appointmentPagination, setAppointmentPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [petsResponse, appointmentsResponse] = await Promise.all([
          api.get('/pets'),
          api.get('/appointments', { params: { page: appointmentPagination.page, pageSize: 3 } }),
        ]);

        setPets(petsResponse.data || []);

        const data = appointmentsResponse.data;
        const items = data?.items ?? data ?? [];
        const pagination = data?.pagination;
        const totalItems = pagination?.totalItems ?? items.length;
        const totalPages =
          pagination?.totalPages ?? Math.max(1, Math.ceil(totalItems / (pagination?.pageSize || 3)));
        const currentPage = pagination?.page ?? appointmentPagination.page;
        setAppointments(items);
        setAppointmentPagination({
          page: currentPage,
          totalPages,
          totalItems,
        });
        setError(null);
      } catch (err) {
        const message =
          err.response?.data?.message || err.message || 'Unable to load dashboard data.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [appointmentPagination.page]);

  const totalPetPages = useMemo(
    () => Math.max(1, Math.ceil(pets.length / PET_PAGE_SIZE)),
    [pets.length],
  );

  const pagedPets = useMemo(() => {
    const start = (petPage - 1) * PET_PAGE_SIZE;
    return pets.slice(start, start + PET_PAGE_SIZE);
  }, [pets, petPage]);

  const upcomingAppointment = useMemo(() => {
    if (!appointments.length) return null;
    const now = dayjs();
    const futureAppointments = appointments.filter((appt) =>
      appt.startTime ? dayjs(appt.startTime).isAfter(now) : false,
    );
    if (futureAppointments.length) {
      return futureAppointments.sort(
        (a, b) => dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf(),
      )[0];
    }
    return appointments[0];
  }, [appointments]);

  if (loading) {
    return (
      <div className="overview-page">
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overview-page">
      <div className="welcome-section">
        <h1>
          Welcome, {userName}! <span className="badge-customer">Customer</span>
        </h1>
        <p>Manage your bookings and shop essentials for your pets in one place.</p>
      </div>

      <div className="action-buttons">
        <button
          type="button"
          className="btn-primary-action"
          onClick={() => navigate('/dashboard/appointments')}
        >
          <i className="fa-solid fa-calendar-check"></i>
          Book appointment
        </button>
        <button
          type="button"
          className="btn-secondary-action"
          onClick={() => navigate('/service')}
        >
          <i className="fa-solid fa-shopping-cart"></i>
          Shop products
        </button>
        <button
          type="button"
          className="btn-secondary-action"
          onClick={() => navigate('/dashboard/profile?tab=pets')}
        >
          <i className="fa-solid fa-paw"></i>
          Add a pet
        </button>
      </div>

      {error && <div className="overview-message error">{error}</div>}

      <div className="dashboard-grid">
        <div className="next-appointment-card">
          <h3>Next appointment</h3>
          {upcomingAppointment ? (
            <div className="appointment-card">
              <div className="appointment-title">{upcomingAppointment.serviceName || 'Service'}</div>
              <div className="appointment-meta">
                {dayjs(upcomingAppointment.startTime).format('DD MMM YYYY · HH:mm')}
              </div>
              <div className="appointment-secondary">
                With {upcomingAppointment.veterinarianName || 'veterinarian'} ·{' '}
                {upcomingAppointment.petName || 'No pet selected'}
              </div>
              <div className="appointment-status-pill">{upcomingAppointment.status}</div>
            </div>
          ) : (
            <div className="appointment-empty">
              <p>None scheduled</p>
              <small>Book a check-up to keep your pet healthy.</small>
            </div>
          )}
        </div>

        <div className="your-pets-card">
          <h3>Your pets</h3>
          <div className="pets-list">
            {pets.length === 0 ? (
              <div className="empty-state compact">
                <i className="fa-solid fa-paw" />
                <p>You haven&apos;t added any pets yet.</p>
                <button
                  type="button"
                  className="btn primary small"
                  onClick={() => navigate('/dashboard/profile?tab=pets')}
                >
                  Add a pet
                </button>
              </div>
            ) : (
              pagedPets.map((pet) => (
                <div key={pet.petId} className="pet-item">
                  <i className="fa-solid fa-paw"></i>
                  <div>
                    <div className="pet-name">{pet.name}</div>
                    <div className="pet-info">
                      {pet.species} · {pet.age ?? '—'} yr{pet.age === 1 ? '' : 's'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {pets.length > 0 && (
            <div className="overview-pagination">
              <button
                type="button"
                className="pagination-btn"
                onClick={() => setPetPage((prev) => Math.max(prev - 1, 1))}
                disabled={petPage <= 1}
              >
                <i className="fa-solid fa-chevron-left" />
              </button>
              <span className="pagination-info">
                Page {petPage} / {totalPetPages}
              </span>
              <button
                type="button"
                className="pagination-btn"
                onClick={() => setPetPage((prev) => Math.min(prev + 1, totalPetPages))}
                disabled={petPage >= totalPetPages}
              >
                <i className="fa-solid fa-chevron-right" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="overview-appointments-section">
        <div className="section-header">
          <h2>Your upcoming appointments</h2>
          <button
            className="btn-view-all"
            type="button"
            onClick={() => navigate('/dashboard/appointments')}
          >
            View all
          </button>
        </div>

        <div className="overview-appointments-list">
          {appointments.length === 0 ? (
            <div className="empty-state compact">
              <i className="fa-solid fa-calendar-days" />
              <p>No upcoming appointments yet.</p>
            </div>
          ) : (
            appointments.map((item) => (
              <div key={item.appointmentId} className="overview-appointment-card">
                <i className="fa-solid fa-calendar-check"></i>
                <div className="overview-appointment-info">
                  <div className="overview-appointment-title">{item.serviceName || 'Service'}</div>
                  <div className="overview-appointment-details">
                    {dayjs(item.startTime).format('DD MMM YYYY · HH:mm')} ·{' '}
                    {item.veterinarianName || 'Veterinarian'} ·{' '}
                    {item.petName || 'No pet selected'}
                  </div>
                </div>
                <span className={`overview-appointment-status status-${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
              </div>
            ))
          )}
          {appointments.length > 0 && (
            <div className="overview-pagination">
              <button
                type="button"
                className="pagination-btn"
                onClick={() =>
                  setAppointmentPagination((prev) => ({
                    ...prev,
                    page: Math.max(prev.page - 1, 1),
                  }))
                }
                disabled={appointmentPagination.page <= 1}
              >
                <i className="fa-solid fa-chevron-left" />
              </button>
              <span className="pagination-info">
                Page {appointmentPagination.page} / {appointmentPagination.totalPages}
              </span>
              <button
                type="button"
                className="pagination-btn"
                onClick={() =>
                  setAppointmentPagination((prev) => ({
                    ...prev,
                    page: Math.min(prev.page + 1, appointmentPagination.totalPages),
                  }))
                }
                disabled={appointmentPagination.page >= appointmentPagination.totalPages}
              >
                <i className="fa-solid fa-chevron-right" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Overview;
