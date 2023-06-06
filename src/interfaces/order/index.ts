import { CustomerInterface } from 'interfaces/customer';
import { SupplierInterface } from 'interfaces/supplier';

export interface OrderInterface {
  id?: string;
  order_number: string;
  status: string;
  customer_id: string;
  supplier_id: string;

  customer?: CustomerInterface;
  supplier?: SupplierInterface;
  _count?: {};
}
