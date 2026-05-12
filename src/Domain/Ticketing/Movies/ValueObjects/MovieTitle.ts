import { ValueObject } from '@/Domain/Shared/mod.ts';
import { InvalidMovieTitleException } from '@/Domain/Ticketing/Movies/mod.ts';

export class MovieTitle extends ValueObject {
    private readonly _value: string;

    private constructor(title: string) {
        super();
        this._value = title;
    }

    static create(value: string): MovieTitle {
        const title = new MovieTitle(value);
        title.validate();
        return title;
    }

    protected validate(): void {
        if (!this._value || this._value.trim() === '') {
            throw new InvalidMovieTitleException(this._value);
        }
    }

    get value(): string {
        return this._value;
    }

    override equals(other: MovieTitle): boolean {
        return this._value == other._value;
    }
}
