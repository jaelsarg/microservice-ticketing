import { DomainException } from '@/Domain/Shared/mod.ts';
import { MovieId } from '@/Domain/Ticketing/Movies/mod.ts';

// Exceptions for AgeRating (Value Object)
export class InvalidAgeRatingException extends DomainException {
    constructor(ageRating: number) {
        super(
            `Movie age rating "${ageRating}" is invalid. Age rating must be a positive integer.`,
        );
    }
}

// Exceptions for Genre (Value Object)
export class InvalidGenreException extends DomainException {
    constructor(genre: string) {
        super(
            `Movie genre "${genre}" is invalid. Genre must not be empty or contain only whitespace.`,
        );
    }
}

// Exceptions for Money (Value Object)
export class InvalidMoneyException extends DomainException {
    constructor(money: number) {
        super(
            `Movie money "${money}" is invalid. Money must be a positive number.`,
        );
    }
}

// Exceptions for MovieDuration (Value Object)
export class InvalidMovieDurationException extends DomainException {
    constructor(duration: number) {
        super(
            `Movie duration "${duration}" is invalid. Duration must be a positive number.`,
        );
    }
}

// Exceptions for MovieTitle (Value Object)
export class InvalidMovieTitleException extends DomainException {
    constructor(title: string) {
        super(
            `Movie title "${title}" is invalid. Title must not be empty or contain only whitespace.`,
        );
    }
}

// Exceptions for PosterUrl (Value Object)
export class InvalidPosterUrlException extends DomainException {
    constructor(posterUrl: string) {
        super(
            `Movie poster URL "${posterUrl}" is invalid. Poster URL must not be empty or contain only whitespace and needs to be a valid HTTP or HTTPS URL.`,
        );
    }
}

// Exceptions for Movie (Aggregate)
export class InvalidGenreLengthException extends DomainException {
    constructor() {
        super(
            `Movie must have at least one genre.`,
        );
    }
}

// Exceptions for not found
export class MovieNotFoundException extends DomainException {
    constructor(movieId: MovieId) {
        super(
            `Movie with ID "${movieId.value}" not found.`,
        );
    }
}
