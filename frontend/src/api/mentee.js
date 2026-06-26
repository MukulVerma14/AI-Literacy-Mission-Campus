import api from './axios';

export const getMenteeProfile = async () => {
  const response = await api.get('/api/mentee/profile');
  return response.data;
};

export const getAvailableCohorts = async (city = '') => {
  const query = city ? `?city=${encodeURIComponent(city)}` : '';
  const response = await api.get(`/api/mentee/cohorts${query}`);
  return response.data;
};

export const joinCohort = async (cohortId) => {
  const response = await api.post(`/api/mentee/cohorts/${cohortId}/join`);
  return response.data;
};

export const getLearningJourney = async () => {
  const response = await api.get('/api/mentee/tracker');
  return response.data;
};

export const logProgress = async (progressData) => {
  const response = await api.post('/api/mentee/tracker', progressData);
  return response.data;
};
