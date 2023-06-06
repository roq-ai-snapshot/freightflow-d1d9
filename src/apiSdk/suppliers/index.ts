import axios from 'axios';
import queryString from 'query-string';
import { SupplierInterface } from 'interfaces/supplier';
import { GetQueryInterface } from '../../interfaces';

export const getSuppliers = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/suppliers${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createSupplier = async (supplier: SupplierInterface) => {
  const response = await axios.post('/api/suppliers', supplier);
  return response.data;
};

export const updateSupplierById = async (id: string, supplier: SupplierInterface) => {
  const response = await axios.put(`/api/suppliers/${id}`, supplier);
  return response.data;
};

export const getSupplierById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/suppliers/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteSupplierById = async (id: string) => {
  const response = await axios.delete(`/api/suppliers/${id}`);
  return response.data;
};
