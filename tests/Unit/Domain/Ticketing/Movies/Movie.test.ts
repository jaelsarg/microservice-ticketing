import { AgeRating, Genre, InvalidAgeRatingException, InvalidGenreException, InvalidGenreLengthException, InvalidMovieDurationException, InvalidMovieTitleException, InvalidPosterUrlException, Movie, MovieDuration, MovieId, MovieTitle, PosterUrl } from '@/Domain/Ticketing/Movies/mod.ts';
import { assertEquals, assertThrows } from '@std/assert';

Deno.test('[Unit] - Movie - create - valid input - returns aggregate with value objects', () => {
    // Arrange
    const id = MovieId.create();
    const title = MovieTitle.create("Title of movie");
    const duration = MovieDuration.create(123);
    const genres = [ Genre.create("Animation"), Genre.create("Family") ];
    const ageRating = AgeRating.create(12);
    const posterUrl = PosterUrl.create("http://posterurl.jpg");
    const price = 0.15 * duration.value;

    // Arrange
    const movie = Movie.create(id, title, duration, genres, ageRating, posterUrl);

    // Assert
    assertEquals(movie.id instanceof MovieId, true);
    assertEquals(movie.id.value, id.value);
    assertEquals(movie.title.value, title.value);
    assertEquals(movie.duration.value, duration.value);
    assertEquals(movie.genres.values, genres.values);
    assertEquals(movie.ageRating.value, ageRating.value);
    assertEquals(movie.posterUrl.value, posterUrl.value);
    assertEquals(movie.price.value, price);
});

Deno.test('[Unit] - Movie - create - invalid title - throws InvalidMovieTitleException', () => {
    // Arrange
    const id = MovieId.create();
    const duration = MovieDuration.create(123);
    const genres = [ Genre.create("Animation"), Genre.create("Family") ];
    const ageRating = AgeRating.create(12);
    const posterUrl = PosterUrl.create("http://posterurl.jpg");

    // Act & Assert
    assertThrows(
        () => {
            const invalidTitle = MovieTitle.create("");
            Movie.create(id, invalidTitle, duration, genres, ageRating, posterUrl);
        },
        InvalidMovieTitleException
    );
});

Deno.test('[Unit] - Movie - create - invalid duration - throws InvalidMovieDurationException', () => {
    // Arrange
    const id = MovieId.create();
    const title = MovieTitle.create("Title of movie");
    const genres = [ Genre.create("Animation"), Genre.create("Family") ];
    const ageRating = AgeRating.create(12);
    const posterUrl = PosterUrl.create("http://posterurl.jpg");

    // Act & Assert
    assertThrows(
        () => {
            const invalidDuration = MovieDuration.create(-123);
            Movie.create(id, title, invalidDuration, genres, ageRating, posterUrl);
        },
        InvalidMovieDurationException
    );
});

Deno.test('[Unit] - Movie - create - invalid genres; empty array - throws InvalidGenreLengthException', () => {
    // Arrange
    const id = MovieId.create();
    const title = MovieTitle.create("Title of movie");
    const duration = MovieDuration.create(123);
    const invalidGenres: Genre[] = [];
    const ageRating = AgeRating.create(12);
    const posterUrl = PosterUrl.create("http://posterurl.jpg");

    // Act & Assert
    assertThrows(
        () => {
            Movie.create(id, title, duration, invalidGenres, ageRating, posterUrl);
        },
        InvalidGenreLengthException
    );
});

Deno.test('[Unit] - Movie - create - invalid genres; empty genre - throws InvalidGenreException', () => {
    // Arrange
    const id = MovieId.create();
    const title = MovieTitle.create("Title of movie");
    const duration = MovieDuration.create(123);
    const ageRating = AgeRating.create(12);
    const posterUrl = PosterUrl.create("http://posterurl.jpg");

    // Act & Assert
    assertThrows(
        () => {
            const invalidGenres = [ Genre.create(""), Genre.create("Family") ];
            Movie.create(id, title, duration, invalidGenres, ageRating, posterUrl);
        },
        InvalidGenreException
    );
});

Deno.test('[Unit] - Movie - create - invalid ageRating - throws InvalidAgeRatingException', () => {
    // Arrange
    const id = MovieId.create();
    const title = MovieTitle.create("Title of movie");
    const duration = MovieDuration.create(123);
    const genres = [ Genre.create("Animation"), Genre.create("Family") ];
    const posterUrl = PosterUrl.create("http://posterurl.jpg");

    // Act & Assert
    assertThrows(
        () => {
            const invalidAgeRating = AgeRating.create(-12);
            Movie.create(id, title, duration, genres, invalidAgeRating, posterUrl);
        },
        InvalidAgeRatingException
    );
});

Deno.test('[Unit] - Movie - create - invalid posterUrl - throws InvalidPosterUrlException', () => {
    // Arrange
    const id = MovieId.create();
    const title = MovieTitle.create("Title of movie");
    const duration = MovieDuration.create(123);
    const genres = [ Genre.create("Animation"), Genre.create("Family") ];
    const ageRating = AgeRating.create(12);

    // Act & Assert
    assertThrows(
        () => {
            const invalidPosterUrl = PosterUrl.create("");
            Movie.create(id, title, duration, genres, ageRating, invalidPosterUrl);
        },
        InvalidPosterUrlException
    );
});

Deno.test('[Unit] - Movie - create - invalid posterUrl - throws InvalidPosterUrlException', () => {
    // Arrange
    const id = MovieId.create();
    const title = MovieTitle.create("Title of movie");
    const duration = MovieDuration.create(123);
    const genres = [ Genre.create("Animation"), Genre.create("Family") ];
    const ageRating = AgeRating.create(12);

    // Act & Assert
    assertThrows(
        () => {
            const invalidPosterUrl = PosterUrl.create("posterurl.jpg");
            Movie.create(id, title, duration, genres, ageRating, invalidPosterUrl);
        },
        InvalidPosterUrlException
    );
});