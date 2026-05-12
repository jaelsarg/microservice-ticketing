import { DomainException } from '@/Domain/Shared/mod.ts';

// Exception thrown when trying to create a Movie with an invalid title
export class InvalidMovieTitleException extends DomainException {
    constructor(title: string) {
        super(
            `Movie title "${title}" is invalid. Title must not be empty or contain only whitespace.`,
        );
    }
}

// Exception thrown when trying to create a Movie with an invalid duration
export class InvalidMovieDurationException extends DomainException {
    constructor(duration: number) {
        super(
            `Movie duration "${duration}" is invalid. Duration must be a positive number.`,
        );
    }
}

// Exception thrown when trying to create a Movie with an invalid genre
export class InvalidGenreException extends DomainException {
    constructor(genre: string) {
        super(
            `Movie genre "${genre}" is invalid. Genre must not be empty or contain only whitespace.`,
        );
    }
}

export class InvalidGenreLengthException extends DomainException {
    constructor(genres: string[]) {
        super(
            `Movie genres "${
                genres.map((g) => g).join(', ')
            }" is invalid. Movie must have at least one genre.`,
        );
    }
}

// Exception thrown when trying to create a Movie with an invalid age rating
export class InvalidAgeRatingException extends DomainException {
    constructor(ageRating: number) {
        super(
            `Movie age rating "${ageRating}" is invalid. Age rating must be a positive integer.`,
        );
    }
}

// Exception thrown when trying to create a Movie with an invalid poster URL
export class InvalidPosterUrlException extends DomainException {
    constructor(posterUrl: string) {
        super(
            `Movie poster URL "${posterUrl}" is invalid. Poster URL must not be empty or contain only whitespace and needs to be a valid HTTP or HTTPS URL.`,
        );
    }
}

// Exception thrown when trying to create a Movie with an invalid money
export class InvalidMoneyException extends DomainException {
    constructor(money: number) {
        super(
            `Movie money "${money}" is invalid. Money must be a positive number.`,
        );
    }
}
