import { ValueObject } from '@/Domain/Shared/mod.ts';
import { InvalidCustomerFirstNameException } from '@/Domain/Ticketing/Orders/mod.ts';

export class CustomerFirstName extends ValueObject {
    private readonly _value: string;

    private constructor(value: string) {
        super();
        this._value = value;
    }

    static create(value: string): CustomerFirstName {
        const customerFirstName = new CustomerFirstName(value);
        customerFirstName.validate();
        return customerFirstName;
    }

    protected validate(): void {
        if (!this._value || this._value.trim() === '') {
            throw new InvalidCustomerFirstNameException();
        }
    }

    get value(): string {
        return this._value;
    }

    override equals(other: CustomerFirstName): boolean {
        return this._value === other._value;
    }
}
