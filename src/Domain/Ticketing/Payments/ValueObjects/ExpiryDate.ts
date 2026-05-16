import { ValueObject } from '@/Domain/Shared/mod.ts';
import {
    EmptyExpiryDateException,
    InvalidExpiryDateException,
    InvalidExpiryDateFormatException,
} from '@/Domain/Ticketing/Payments/mod.ts';

export class ExpiryDate extends ValueObject {
    private readonly _value: string;

    private constructor(value: string) {
        super();
        this._value = value;
    }

    static create(value: string): ExpiryDate {
        const expiryDate = new ExpiryDate(value);
        expiryDate.validate();
        return expiryDate;
    }

    validate(): void {
        if (!this._value || this._value.trim() === '') {
            throw new EmptyExpiryDateException();
        }

        const raw = this._value.trim();
        const pattern = /^(\d{2})\/(\d{2}|\d{4})$/;

        if (!pattern.test(raw)) {
            throw new InvalidExpiryDateFormatException();
        }

        const [monthStr, _yearStr] = raw.split('/');
        const month = Number(monthStr);

        if (month < 1 || month > 12) {
            throw new InvalidExpiryDateException(this._value);
        }
    }

    get value(): string {
        return this._value;
    }

    override equals(other: ExpiryDate): boolean {
        return this._value === other._value;
    }
}
