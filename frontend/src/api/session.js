import api from './axios';

export const scheduleSession = async (cohortId, data) => {
  const response = await api.post(`/api/mentor/cohorts/${cohortId}/sessions`, data);
  return response.data;
};

export const getCohortSessions = async (cohortId) => {
  const response = await api.get(`/api/mentor/cohorts/${cohortId}/sessions`);
  return response.data;
};

export const getSession = async (cohortId, sessionId) => {
  const response = await api.get(`/api/mentor/cohorts/${cohortId}/sessions/${sessionId}`);
  return response.data;
};
