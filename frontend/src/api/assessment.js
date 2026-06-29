import api from './axios';

export const gradeAssessment = async (data) => {
  const response = await api.post(`/api/mentor/assessments`, data);
  return response.data;
};

export const getCohortAssessments = async (cohortId, type) => {
  const response = await api.get(`/api/mentor/cohorts/${cohortId}/assessments?type=${type}`);
  return response.data;
};

export const getMenteeAssessments = async (menteeId) => {
  const response = await api.get(`/api/mentor/mentees/${menteeId}/assessments`);
  return response.data;
};

export const getMyAssessments = async () => {
  const response = await api.get(`/api/mentee/assessments`);
  return response.data;
};
