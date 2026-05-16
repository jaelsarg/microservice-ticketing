import { ValueObject } from '@/Domain/Shared/mod.ts';
import { EmptyCVVException, InvalidCVVException } from '@/Domain/Ticketing/Payments/mod.ts';

export class CVV extends ValueObject {
    private readonly _value: string;

    private constructor(value: string) {
        super();
        this._value = value;
    }

    static create(value: string): CVV {
        const cvv = new CVV(value);
        cvv.validate();
        return cvv;
    }

    validate(): void {
        if (!this._value || this._value.trim() === '') {
            throw new EmptyCVVException();
        }

        if (this._value.length < 3 || this._value.length > 4) {
            throw new InvalidCVVException(this._value);
        }
    }

    get value(): string {
        return this._value;
    }

    override equals(other: CVV): boolean {
        return this._value === other._value;
    }
}
