import { Payment, PaymentId } from '@/Domain/Ticketing/Payments/mod.ts';
import { Repository } from '@/Domain/Shared/mod.ts';

export interface PaymentRepository extends Repository<Payment, PaymentId> {}
