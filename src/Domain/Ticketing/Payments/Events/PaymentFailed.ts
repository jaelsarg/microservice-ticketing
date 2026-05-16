import { PaymentDomainEvent } from '@/Domain/Ticketing/Payments/mod.ts';
import { EventFQDN } from '@/Domain/Shared/mod.ts';

export class PaymentFailed extends PaymentDomainEvent {
    static readonly FQDN: EventFQDN = EventFQDN.create(
        `${PaymentDomainEvent.FQDN_PREFIX}.paymentfailed`,
    );

    private readonly _paymentId: string;
    private readonly _orderId: string;
    private readonly _bookingId: string;
    private readonly _failedReason: string;
    private readonly _occurredOn: Date;

    private constructor(
        paymentId: string,
        orderId: string,
        bookingId: string,
        failedReason: string,
    ) {
        super();
        this._paymentId = paymentId;
        this._orderId = orderId;
        this._bookingId = bookingId;
        this._failedReason = failedReason;
        this._occurredOn = new Date();
    }

    static create(
        paymentId: string,
        orderId: string,
        bookingId: string,
        failedReason: string,
    ): PaymentFailed {
        return new PaymentFailed(paymentId, orderId, bookingId, failedReason);
    }

    override get FQDN(): EventFQDN {
        return PaymentFailed.FQDN;
    }

    override get occurredOn(): Date {
        return this._occurredOn;
    }

    get paymentId(): string {
        return this._paymentId;
    }

    get orderId(): string {
        return this._orderId;
    }

    get bookingId(): string {
        return this._bookingId;
    }

    get failedReason(): string {
        return this._failedReason;
    }
}
