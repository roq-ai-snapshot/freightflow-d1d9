import axios from 'axios';
import queryString from 'query-string';
import { RouteInterface } from 'interfaces/route';
import { GetQueryInterface } from '../../interfaces';

export const getRoutes = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/routes${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createRoute = async (route: RouteInterface) => {
  const response = await axios.post('/api/routes', route);
  return response.data;
};

export const updateRouteById = async (id: string, route: RouteInterface) => {
  const response = await axios.put(`/api/routes/${id}`, route);
  return response.data;
};

export const getRouteById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/routes/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteRouteById = async (id: string) => {
  const response = await axios.delete(`/api/routes/${id}`);
  return response.data;
};
