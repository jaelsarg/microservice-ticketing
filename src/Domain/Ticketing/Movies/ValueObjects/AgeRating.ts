import { ValueObject } from '@/Domain/Shared/mod.ts';
import { InvalidAgeRatingException } from '@/Domain/Ticketing/Movies/mod.ts';

export class AgeRating extends ValueObject {
    private readonly _value: number;

    private constructor(ageRating: number) {
        super();
        this._value = ageRating;
    }

    static create(value: number): AgeRating {
        const ageRating = new AgeRating(value);
        ageRating.validate();
        return ageRating;
    }

    protected validate(): void {
        if (this._value <= 0) {
            throw new InvalidAgeRatingException(this._value);
        }
    }

    get value(): number {
        return this._value;
    }

    override equals(other: AgeRating): boolean {
        return this._value == other._value;
    }
}