import * as yup from 'yup';
import { routeValidationSchema } from 'validationSchema/routes';
import { shipmentValidationSchema } from 'validationSchema/shipments';
import { warehouseValidationSchema } from 'validationSchema/warehouses';

export const logisticsCompanyValidationSchema = yup.object().shape({
  name: yup.string().required(),
  user_id: yup.string().nullable().required(),
  route: yup.array().of(routeValidationSchema),
  shipment: yup.array().of(shipmentValidationSchema),
  warehouse: yup.array().of(warehouseValidationSchema),
});
