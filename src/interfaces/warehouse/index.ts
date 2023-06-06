import { InventoryInterface } from 'interfaces/inventory';
import { LogisticsCompanyInterface } from 'interfaces/logistics-company';

export interface WarehouseInterface {
  id?: string;
  name: string;
  location: string;
  logistics_company_id: string;
  inventory?: InventoryInterface[];
  logistics_company?: LogisticsCompanyInterface;
  _count?: {
    inventory?: number;
  };
}
