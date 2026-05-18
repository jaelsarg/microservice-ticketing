import { Policy, UseCase } from '@/Application/Ports/mod.ts';
import { OrderPaid } from '@/Domain/Ticketing/Orders/mod.ts';
import { ReleaseTicketsInput } from '@/Application/Ticketing/Orders/mod.ts';

export class WhenOrderPaidThenReleaseTickets implements Policy<OrderPaid> {
    private readonly _releaseTickets: UseCase<ReleaseTicketsInput, void>;

    constructor(releaseTickets: UseCase<ReleaseTicketsInput, void>) {
        this._releaseTickets = releaseTickets;
    }

    async handle(event: OrderPaid): Promise<void> {
        console.log('WhenOrderPaidThenReleaseTickets', {
            orderId: event.orderId,
        });

        const input: ReleaseTicketsInput = {
            orderId: event.orderId,
        };

        await this._releaseTickets.execute(input);
    }
}
