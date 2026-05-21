import { PaymentFailed, PaymentSuccess } from '@/Domain/Ticketing/Payments/mod.ts';
import {
    WhenPaymentFailedThenCancelOrder,
    WhenPaymentSucceededThenMarkOrderAsPaid,
} from '@/Application/Ticketing/Payments/mod.ts';
import { OrderPaid } from '@/Domain/Ticketing/Orders/mod.ts';
import { WhenOrderPaidThenReleaseTickets } from '@/Application/Ticketing/Orders/mod.ts';

export const domainEventPolicies: Map<string, string[]> = new Map([
    [
        PaymentSuccess.FQDN.toString(),
        [WhenPaymentSucceededThenMarkOrderAsPaid.name],
    ],
    [
        OrderPaid.FQDN.toString(),
        [WhenOrderPaidThenReleaseTickets.name],
    ],
    [
        PaymentFailed.FQDN.toString(),
        [WhenPaymentFailedThenCancelOrder.name],
    ],
]);
