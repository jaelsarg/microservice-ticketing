import { ValueObject } from '@/Domain/Shared/mod.ts';
import { InvalidMoneyException } from '@/Domain/Ticketing/Movies/mod.ts';

export class Money extends ValueObject {
    private readonly _value: number;

    private constructor(value: number) {
        super();
        this._value = value;
    }

    static create(value: number): Money {
        const money = new Money(value);
        money.validate();
        return money;
    }

    protected validate(): void {
        if (this._value <= 0) {
            throw new InvalidMoneyException(this._value);
        }
    }

    get value(): number {
        return this._value;
    }

    override equals(other: Money): boolean {
        return this._value == other._value;
    }
}