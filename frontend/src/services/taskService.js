import apiClient from './apiClient';

export const listTasks = (filters = {}) => apiClient.get('/tasks', { params: filters });

export const getTask = (taskId) => apiClient.get(`/tasks/${taskId}`);

export const createTask = (payload) => apiClient.post('/tasks', payload);

export const updateTask = (taskId, payload) => apiClient.patch(`/tasks/${taskId}`, payload);

export const deleteTask = (taskId) => apiClient.delete(`/tasks/${taskId}`);
