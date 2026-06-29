import api from './axios';

export const markAttendance = async (sessionId, data) => {
  const response = await api.post(`/api/mentor/sessions/${sessionId}/attendance`, data);
  return response.data;
};

export const markBulkAttendance = async (sessionId, data) => {
  const response = await api.post(`/api/mentor/sessions/${sessionId}/attendance/bulk`, data);
  return response.data;
};

export const getSessionAttendance = async (sessionId) => {
  const response = await api.get(`/api/mentor/sessions/${sessionId}/attendance`);
  return response.data;
};

export const getMyAttendance = async () => {
  const response = await api.get(`/api/mentee/attendance`);
  return response.data;
};
