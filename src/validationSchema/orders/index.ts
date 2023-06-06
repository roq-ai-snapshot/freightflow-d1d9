import * as yup from 'yup';

export const orderValidationSchema = yup.object().shape({
  order_number: yup.string().required(),
  status: yup.string().required(),
  customer_id: yup.string().nullable().required(),
  supplier_id: yup.string().nullable().required(),
});
