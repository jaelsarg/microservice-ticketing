import { ValueObject } from '@/Domain/Shared/mod.ts';
import { InvalidMovieDurationException } from '@/Domain/Ticketing/Movies/mod.ts';

export class MovieDuration extends ValueObject {
    private static readonly INTERMISSION_DURATION: number = 10;

    private readonly _value: number;

    private constructor(duration: number) {
        super();
        this._value = duration;
    }

    static create(value: number): MovieDuration {
        let duration;

        if (value > 100) {
            duration = new MovieDuration(value + MovieDuration.INTERMISSION_DURATION);
        } else {
            duration = new MovieDuration(value);
        }
        
        duration.validate();
        return duration;
    }

    protected validate(): void {
        if (this._value <= 0) {
            throw new InvalidMovieDurationException(this._value);
        }
    }

    get value(): number {
        return this._value;
    }

    override equals(other: MovieDuration): boolean {
        return this._value == other._value;
    }
}