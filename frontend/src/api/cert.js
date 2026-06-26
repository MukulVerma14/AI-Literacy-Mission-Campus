import api from './axios';

export const issueCertificate = async (menteeId, certData) => {
  const response = await api.post(`/api/cert/issue/${menteeId}`, certData);
  return response.data;
};

export const getMyCertificate = async () => {
  const response = await api.get('/api/cert/my');
  return response.data;
};

export const updatePaymentStatus = async (certId, paymentData) => {
  const response = await api.patch(`/api/cert/${certId}/payment`, paymentData);
  return response.data;
};
