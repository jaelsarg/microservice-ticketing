import { ValueObject } from '@/Domain/Shared/mod.ts';
import { InvalidCustomerLastNameException } from '@/Domain/Ticketing/Orders/mod.ts';

export class CustomerLastName extends ValueObject {
    private readonly _value: string;

    private constructor(value: string) {
        super();
        this._value = value;
    }

    static create(value: string): CustomerLastName {
        const customerLastName = new CustomerLastName(value);
        customerLastName.validate();
        return customerLastName;
    }

    protected validate(): void {
        if (!this._value || this._value.trim() === '') {
            throw new InvalidCustomerLastNameException();
        }
    }

    get value(): string {
        return this._value;
    }

    override equals(other: CustomerLastName): boolean {
        return this._value === other._value;
    }
}
