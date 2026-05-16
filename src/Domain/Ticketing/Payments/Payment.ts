import { AggregateRoot, UUIDEntityId } from '@/Domain/Shared/mod.ts';
import { BookingId, OrderId } from '@/Domain/Ticketing/Orders/mod.ts';
import {
    CardNumber,
    CVV,
    ExpiryDate,
    ExternalId,
    InvalidFailedReasonException,
    PaymentAmount,
    PaymentFailed,
    PaymentMethod,
    PaymentStatus,
    PaymentSuccess,
} from '@/Domain/Ticketing/Payments/mod.ts';
import { PaymentStatusState } from '@/Domain/Ticketing/Payments/ValueObjects/PaymentStatus.ts';

export class PaymentId extends UUIDEntityId {
    private constructor(id?: string) {
        super(id);
    }

    static create(id?: string): PaymentId {
        return new PaymentId(id);
    }
}

export class Payment extends AggregateRoot<PaymentId> {
    private readonly _externalId: ExternalId;
    private readonly _paymentMethod: PaymentMethod;
    private readonly _cardNumber: CardNumber;
    private readonly _expiryDate: ExpiryDate;
    private readonly _cvv: CVV;
    private readonly _orderId: OrderId;
    private readonly _bookingId: BookingId;
    private readonly _amount: PaymentAmount;
    private _status: PaymentStatus;

    private constructor(
        id: PaymentId,
        externalId: ExternalId,
        paymentMethod: PaymentMethod,
        cardNumber: CardNumber,
        expiryDate: ExpiryDate,
        cvv: CVV,
        orderId: OrderId,
        bookingId: BookingId,
        amount: PaymentAmount,
        status: PaymentStatus,
    ) {
        super(id);
        this._externalId = externalId;
        this._paymentMethod = paymentMethod;
        this._cardNumber = cardNumber;
        this._expiryDate = expiryDate;
        this._cvv = cvv;
        this._orderId = orderId;
        this._bookingId = bookingId;
        this._amount = amount;
        this._status = status;
    }

    static create(
        externalId: ExternalId,
        paymentMethod: PaymentMethod,
        cardNumber: CardNumber,
        expiryDate: ExpiryDate,
        cvv: CVV,
        orderId: OrderId,
        bookingId: BookingId,
        amount: PaymentAmount,
    ): Payment {
        const payment = new Payment(
            PaymentId.create(),
            externalId,
            paymentMethod,
            cardNumber,
            expiryDate,
            cvv,
            orderId,
            bookingId,
            amount,
            PaymentStatus.create(PaymentStatusState.Pending),
        );

        return payment;
    }

    markAsSucceeded(): void {
        this._status = this._status.transitionTo(PaymentStatus.Success);
        this.raise(PaymentSuccess.create(this.id.value, this.orderId.value, this.bookingId.value));
    }

    markAsFailed(failedReason: string): void {
        if (!failedReason || failedReason.trim() === '') {
            throw new InvalidFailedReasonException();
        }

        this._status = this._status.transitionTo(PaymentStatus.Failed);
        this.raise(
            PaymentFailed.create(
                this.id.value,
                this.orderId.value,
                this.bookingId.value,
                failedReason,
            ),
        );
    }

    get externalId(): ExternalId {
        return this._externalId;
    }

    get paymentMethod(): PaymentMethod {
        return this._paymentMethod;
    }

    get cardNumber(): CardNumber {
        return this._cardNumber;
    }

    get expiryDate(): ExpiryDate {
        return this._expiryDate;
    }

    get cvv(): CVV {
        return this._cvv;
    }

    get orderId(): OrderId {
        return this._orderId;
    }

    get bookingId(): BookingId {
        return this._bookingId;
    }

    get amount(): PaymentAmount {
        return this._amount;
    }

    get status(): PaymentStatus {
        return this._status;
    }
}
