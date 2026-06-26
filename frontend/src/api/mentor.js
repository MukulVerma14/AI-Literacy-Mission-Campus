import api from './axios';

export const getMentorProfile = async () => {
  const response = await api.get('/api/mentor/profile');
  return response.data;
};

export const getMentorCohorts = async () => {
  const response = await api.get('/api/mentor/cohorts');
  return response.data;
};

export const createCohort = async (cohortData) => {
  const response = await api.post('/api/mentor/cohorts', cohortData);
  return response.data;
};

export const getCohortMembers = async (cohortId) => {
  const response = await api.get(`/api/mentor/cohorts/${cohortId}/members`);
  return response.data;
};

export const getCohortProgress = async (cohortId) => {
  const response = await api.get(`/api/mentor/cohorts/${cohortId}/progress`);
  return response.data;
};
