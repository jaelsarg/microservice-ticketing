import { Policy, UseCase } from '@/Application/Ports/mod.ts';
import { PaymentFailed } from '@/Domain/Ticketing/Payments/mod.ts';
import { CancelOrderInput } from '@/Application/Ticketing/Orders/mod.ts';

export class WhenPaymentFailedThenCancelOrder implements Policy<PaymentFailed> {
    private readonly _cancelOrder: UseCase<CancelOrderInput, void>;

    constructor(cancelOrder: UseCase<CancelOrderInput, void>) {
        this._cancelOrder = cancelOrder;
    }

    async handle(event: PaymentFailed): Promise<void> {
        console.log('WhenPaymentFailedThenCancelOrder', {
            orderId: event.orderId,
        });

        const input: CancelOrderInput = {
            orderId: event.orderId,
        };

        await this._cancelOrder.execute(input);
    }

}