import { LogisticsCompanyInterface } from 'interfaces/logistics-company';

export interface RouteInterface {
  id?: string;
  origin: string;
  destination: string;
  distance: number;
  logistics_company_id: string;

  logistics_company?: LogisticsCompanyInterface;
  _count?: {};
}
