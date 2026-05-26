import { OrderDomainEvent } from '@/Domain/Ticketing/Orders/mod.ts';
import { EventFQDN } from '@/Domain/Shared/mod.ts';

export class OrderPaid extends OrderDomainEvent {
    static readonly FQDN: EventFQDN = EventFQDN.create(
        `${OrderDomainEvent.FQDN_PREFIX}.orderpaid`,
    );

    private readonly _orderId: string;
    private readonly _bookingId: string;
    private readonly _occurredOn: Date;

    private constructor(orderId: string, bookingId: string) {
        super();
        this._orderId = orderId;
        this._bookingId = bookingId;
        this._occurredOn = new Date();
    }

    static create(orderId: string, bookingId: string): OrderPaid {
        return new OrderPaid(orderId, bookingId);
    }

    override get FQDN(): EventFQDN {
        return OrderPaid.FQDN;
    }

    override get occurredOn(): Date {
        return this._occurredOn;
    }

    get orderId(): string {
        return this._orderId;
    }

    get bookingId(): string {
        return this._bookingId;
    }
}
