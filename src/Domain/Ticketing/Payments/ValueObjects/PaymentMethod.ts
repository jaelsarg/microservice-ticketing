import { ValueObject } from '@/Domain/Shared/mod.ts';

export enum PaymentMethodType {
    CreditCard = 'CreditCard',
    BankTransfer = 'BankTransfer',
}

export class PaymentMethod extends ValueObject {
    private readonly _value: PaymentMethodType;

    private constructor(value: PaymentMethodType) {
        super();
        this._value = value;
    }

    static create(value: PaymentMethodType): PaymentMethod {
        const paymentMethod = new PaymentMethod(value);
        return paymentMethod;
    }

    get value(): PaymentMethodType {
        return this._value;
    }

    override equals(other: PaymentMethod): boolean {
        return this._value === other._value;
    }
}
