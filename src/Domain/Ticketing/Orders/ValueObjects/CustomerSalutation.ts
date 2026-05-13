import { ValueObject } from '@/Domain/Shared/mod.ts';

export enum CustomerSalutationType {
    Mr = 'Mr.',
    Ms = 'Ms.',
    Mx = 'Mx.',
}

export class CustomerSalutation extends ValueObject {
    private readonly _value: CustomerSalutationType;

    private constructor(value: CustomerSalutationType) {
        super();
        this._value = value;
    }

    static create(value: CustomerSalutationType): CustomerSalutation {
        const customerSalutation = new CustomerSalutation(value);
        return customerSalutation;
    }

    get value(): string {
        return this._value;
    }

    override equals(other: CustomerSalutation): boolean {
        return this._value === other._value;
    }
}
