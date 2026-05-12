import { ValueObject } from '@/Domain/Shared/mod.ts';
import { InvalidGenreException } from '@/Domain/Ticketing/Movies/mod.ts';

export class Genre extends ValueObject {
    private readonly _value: string;

    private constructor(genre: string) {
        super();
        this._value = genre;
    }

    static create(value: string): Genre {
        const genre = new Genre(value);
        genre.validate();
        return genre;
    }

    protected validate(): void {
        if (!this._value || this._value.trim() === '') {
            throw new InvalidGenreException(this._value);
        }
    }

    get value(): string {
        return this._value;
    }

    override equals(other: Genre): boolean {
        return this._value == other._value;
    }
}
