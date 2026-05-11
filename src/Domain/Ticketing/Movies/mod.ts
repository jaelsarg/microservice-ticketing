// Aggregate Root
export { Movie, MovieId } from './Movie.ts';

// Value Objects
export { MovieTitle } from './ValueObjects/MovieTitle.ts';
export { MovieDuration } from './ValueObjects/MovieDuration.ts';
export { Genre } from './ValueObjects/Genre.ts';
export { AgeRating } from './ValueObjects/AgeRating.ts';
export { PosterUrl } from './ValueObjects/PosterUrl.ts';
export { Money } from './ValueObjects/Money.ts';

// Exceptions
export {
    InvalidMovieTitleException,
    InvalidMovieDurationException,
    InvalidGenreException,
    InvalidGenreLengthException,
    InvalidAgeRatingException,
    InvalidPosterUrlException,
    InvalidMoneyException,
    MoneyCalculationException
} from './MovieExceptions.ts';

// Repository Interface
export type { MovieRepository } from './MovieRepository.ts';