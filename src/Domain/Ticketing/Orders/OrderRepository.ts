import { Order, OrderId } from '@/Domain/Ticketing/Orders/mod.ts';
import { Repository } from '@/Domain/Shared/mod.ts';

export interface OrderRepository extends Repository<Order, OrderId> {}
