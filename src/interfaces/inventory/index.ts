import { WarehouseInterface } from 'interfaces/warehouse';

export interface InventoryInterface {
  id?: string;
  product_name: string;
  quantity: number;
  warehouse_id: string;

  warehouse?: WarehouseInterface;
  _count?: {};
}
