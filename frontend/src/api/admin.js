import api from './axios';

export const getAdminStats = async () => {
  const response = await api.get('/api/admin/stats');
  return response.data;
};

export const getAllMentors = async () => {
  const response = await api.get('/api/admin/mentors');
  return response.data;
};

export const getAllCohorts = async () => {
  const response = await api.get('/api/admin/cohorts');
  return response.data;
};

export const getAllMentees = async () => {
  const response = await api.get('/api/admin/mentees');
  return response.data;
};

export const getAllCertifications = async () => {
  const response = await api.get('/api/admin/certifications');
  return response.data;
};
