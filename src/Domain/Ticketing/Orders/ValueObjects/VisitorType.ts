import { ValueObject } from '@/Domain/Shared/mod.ts';

export enum VisitorTypeState {
    Standard = 'Standard',
    Discounted = 'Discounted',
}

export class VisitorType extends ValueObject {
    private readonly _value: VisitorTypeState;

    private constructor(value: VisitorTypeState) {
        super();
        this._value = value;
    }

    static create(value: VisitorTypeState): VisitorType {
        return new VisitorType(value);
    }

    get value(): VisitorTypeState {
        return this._value;
    }

    override equals(other: VisitorType): boolean {
        if (!other) {
            return false;
        }

        return this._value === other._value;
    }
}
