import { OrderInterface } from 'interfaces/order';
import { UserInterface } from 'interfaces/user';

export interface CustomerInterface {
  id?: string;
  name: string;
  user_id: string;
  order?: OrderInterface[];
  user?: UserInterface;
  _count?: {
    order?: number;
  };
}
