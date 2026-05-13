import { ValueObject } from '@/Domain/Shared/mod.ts';
import { EmailEmptyException, InvalidEmailFormatException } from '@/Domain/Ticketing/Orders/mod.ts';

export class CustomerEmail extends ValueObject {
    private readonly _value: string;

    private constructor(value: string) {
        super();
        this._value = value;
    }

    static create(value: string): CustomerEmail {
        const customerEmail = new CustomerEmail(value);
        customerEmail.validate();
        return customerEmail;
    }

    protected validate(): void {
        if (!this._value || this._value.trim() === '') {
            throw new EmailEmptyException();
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this._value)) {
            throw new InvalidEmailFormatException(this._value);
        }
    }

    get value(): string {
        return this._value;
    }

    override equals(other: CustomerEmail): boolean {
        return this._value === other._value;
    }
}
