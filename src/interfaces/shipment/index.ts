import { LogisticsCompanyInterface } from 'interfaces/logistics-company';

export interface ShipmentInterface {
  id?: string;
  tracking_number: string;
  status: string;
  logistics_company_id: string;

  logistics_company?: LogisticsCompanyInterface;
  _count?: {};
}
