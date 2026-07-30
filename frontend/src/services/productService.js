import api from '../api/axios';

export const getAll = () => api.get('/products');

export const getById = (id) => api.get(`/products/${id}`);

export const create = (data) => api.post('/products', data);

export const update = (id, data) => api.patch(`/products/${id}`, data);

export const remove = (id) => api.delete(`/products/${id}`);
