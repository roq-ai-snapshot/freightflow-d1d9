import * as yup from 'yup';
import { orderValidationSchema } from 'validationSchema/orders';

export const supplierValidationSchema = yup.object().shape({
  name: yup.string().required(),
  user_id: yup.string().nullable().required(),
  order: yup.array().of(orderValidationSchema),
});
