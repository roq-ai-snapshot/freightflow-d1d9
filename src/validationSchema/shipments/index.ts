import * as yup from 'yup';

export const shipmentValidationSchema = yup.object().shape({
  tracking_number: yup.string().required(),
  status: yup.string().required(),
  logistics_company_id: yup.string().nullable().required(),
});
