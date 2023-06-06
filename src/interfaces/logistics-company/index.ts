import { RouteInterface } from 'interfaces/route';
import { ShipmentInterface } from 'interfaces/shipment';
import { WarehouseInterface } from 'interfaces/warehouse';
import { UserInterface } from 'interfaces/user';

export interface LogisticsCompanyInterface {
  id?: string;
  name: string;
  user_id: string;
  route?: RouteInterface[];
  shipment?: ShipmentInterface[];
  warehouse?: WarehouseInterface[];
  user?: UserInterface;
  _count?: {
    route?: number;
    shipment?: number;
    warehouse?: number;
  };
}
