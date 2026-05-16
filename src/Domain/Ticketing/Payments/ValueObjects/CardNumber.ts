import { ValueObject } from '@/Domain/Shared/mod.ts';
import { InvalidCardNumberException } from '@/Domain/Ticketing/Payments/mod.ts';

export class CardNumber extends ValueObject {
    private readonly _value: string;

    private constructor(value: string) {
        super();
        this._value = value;
    }

    static create(value: string): CardNumber {
        const cardNumber = new CardNumber(value);
        cardNumber.validate();
        return cardNumber;
    }

    validate(): void {
        if (
            !this._value || this._value.trim() === '' || this._value.length < 12 ||
            this._value.length > 19
        ) {
            throw new InvalidCardNumberException();
        }
    }

    get value(): string {
        return this._value;
    }

    override equals(other: CardNumber): boolean {
        return this._value === other._value;
    }
}
