import api from './api';

export const fetchVeterinarianDashboard = (params = {}, options = {}) => {
  const config = { ...options };
  config.params = { ...(options.params ?? {}), ...params };

  return api
    .get('/veterinarian-dashboard', config)
    .then((response) => response.data);
};

export const updateVeterinarianAppointmentStatus = (
  appointmentId,
  payload,
  options = {}
) => {
  if (!appointmentId) {
    return Promise.reject(new Error('appointmentId is required'));
  }

  return api
    .patch(`/veterinarian-dashboard/${appointmentId}/status`, payload, options)
    .then((response) => response.data);
};

const vetDashboardService = {
  fetchVeterinarianDashboard,
  updateVeterinarianAppointmentStatus,
};

export default vetDashboardService;
