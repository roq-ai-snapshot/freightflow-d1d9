import * as yup from 'yup';

export const routeValidationSchema = yup.object().shape({
  origin: yup.string().required(),
  destination: yup.string().required(),
  distance: yup.number().integer().required(),
  logistics_company_id: yup.string().nullable().required(),
});
