import apiClient from './apiClient';

export const getTaskSummary = (filters = {}) =>
  apiClient.get('/reports/summary', { params: filters });
