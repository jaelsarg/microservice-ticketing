import { Policy, UseCase } from '@/Application/Ports/mod.ts';
import { PaymentSuccess } from '@/Domain/Ticketing/Payments/mod.ts';
import { MarkOrderAsPaidInput } from '@/Application/Ticketing/Orders/mod.ts';

export class WhenPaymentSucceededThenMarkOrderAsPaid implements Policy<PaymentSuccess> {
    private readonly _markOrderAsPaid: UseCase<MarkOrderAsPaidInput, void>;

    constructor(markOrderAsPaid: UseCase<MarkOrderAsPaidInput, void>) {
        this._markOrderAsPaid = markOrderAsPaid;
    }

    async handle(event: PaymentSuccess): Promise<void> {
        console.log('WhenPaymentSucceededThenMarkOrderAsPaid', {
            orderId: event.orderId,
        });

        const input: MarkOrderAsPaidInput = {
            orderId: event.orderId,
        };

        await this._markOrderAsPaid.execute(input);
    }
}
