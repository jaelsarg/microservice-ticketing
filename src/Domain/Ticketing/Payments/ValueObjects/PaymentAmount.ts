import { ValueObject } from '@/Domain/Shared/mod.ts';
import { InvalidPaymentAmountException } from '@/Domain/Ticketing/Payments/mod.ts';

export class PaymentAmount extends ValueObject {
    private readonly _value: number;

    private constructor(value: number) {
        super();
        this._value = value;
    }

    static create(value: number): PaymentAmount {
        const paymentAmount = new PaymentAmount(value);
        paymentAmount.validate();
        return paymentAmount;
    }

    validate(): void {
        if (!Number.isFinite(this._value) || this._value <= 0) {
            throw new InvalidPaymentAmountException(this._value);
        }
    }

    get value(): number {
        return this._value;
    }

    override equals(other: PaymentAmount): boolean {
        return this._value === other._value;
    }
}
