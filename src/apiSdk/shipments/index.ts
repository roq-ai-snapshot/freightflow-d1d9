import axios from 'axios';
import queryString from 'query-string';
import { ShipmentInterface } from 'interfaces/shipment';
import { GetQueryInterface } from '../../interfaces';

export const getShipments = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/shipments${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createShipment = async (shipment: ShipmentInterface) => {
  const response = await axios.post('/api/shipments', shipment);
  return response.data;
};

export const updateShipmentById = async (id: string, shipment: ShipmentInterface) => {
  const response = await axios.put(`/api/shipments/${id}`, shipment);
  return response.data;
};

export const getShipmentById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/shipments/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteShipmentById = async (id: string) => {
  const response = await axios.delete(`/api/shipments/${id}`);
  return response.data;
};
