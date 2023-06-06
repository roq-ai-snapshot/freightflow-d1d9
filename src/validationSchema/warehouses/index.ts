import * as yup from 'yup';
import { inventoryValidationSchema } from 'validationSchema/inventories';

export const warehouseValidationSchema = yup.object().shape({
  name: yup.string().required(),
  location: yup.string().required(),
  logistics_company_id: yup.string().nullable().required(),
  inventory: yup.array().of(inventoryValidationSchema),
});
