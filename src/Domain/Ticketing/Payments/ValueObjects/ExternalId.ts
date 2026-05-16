import { ValueObject } from '@/Domain/Shared/mod.ts';
import { InvalidExternalIdException } from '@/Domain/Ticketing/Payments/mod.ts';

export class ExternalId extends ValueObject {
    private readonly _value: string;

    private constructor(value: string) {
        super();
        this._value = value;
    }

    static create(value: string): ExternalId {
        const externalId = new ExternalId(value);
        externalId.validate();
        return externalId;
    }

    validate(): void {
        if (!this._value || this._value.trim() === '') {
            throw new InvalidExternalIdException();
        }
    }

    get value(): string {
        return this._value;
    }

    override equals(other: ExternalId): boolean {
        return this._value === other._value;
    }
}
