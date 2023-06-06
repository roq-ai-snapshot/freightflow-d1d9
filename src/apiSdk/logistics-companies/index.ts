import axios from 'axios';
import queryString from 'query-string';
import { LogisticsCompanyInterface } from 'interfaces/logistics-company';
import { GetQueryInterface } from '../../interfaces';

export const getLogisticsCompanies = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/logistics-companies${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createLogisticsCompany = async (logisticsCompany: LogisticsCompanyInterface) => {
  const response = await axios.post('/api/logistics-companies', logisticsCompany);
  return response.data;
};

export const updateLogisticsCompanyById = async (id: string, logisticsCompany: LogisticsCompanyInterface) => {
  const response = await axios.put(`/api/logistics-companies/${id}`, logisticsCompany);
  return response.data;
};

export const getLogisticsCompanyById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/logistics-companies/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteLogisticsCompanyById = async (id: string) => {
  const response = await axios.delete(`/api/logistics-companies/${id}`);
  return response.data;
};
