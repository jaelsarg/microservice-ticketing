import { ValueObject } from '@/Domain/Shared/mod.ts';
import { InvalidPosterUrlException } from '@/Domain/Ticketing/Movies/mod.ts';

export class PosterUrl extends ValueObject {
    private readonly _value: string;

    private constructor(posterUrl: string) {
        super();
        this._value = posterUrl;
    }

    static create(value: string): PosterUrl {
        const posterUrl = new PosterUrl(value);
        posterUrl.validate();
        return posterUrl;
    }

    protected validate(): void {
        if (!this._value || this._value.trim() === '') {
            throw new InvalidPosterUrlException(this._value);
        }

        try {
            const url = new URL(this._value);
            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                throw new InvalidPosterUrlException(this._value);
            }
        } catch (error) {
            if (error instanceof InvalidPosterUrlException) {
                throw error;
            }
            throw new InvalidPosterUrlException(this._value);
        }
    }

    get value(): string {
        return this._value;
    }

    override equals(other: PosterUrl): boolean {
        return this._value == other._value;
    }
}
