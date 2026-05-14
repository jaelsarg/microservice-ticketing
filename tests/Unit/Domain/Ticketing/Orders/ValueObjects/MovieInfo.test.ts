import { MovieInfo } from '@/Domain/Ticketing/Orders/mod.ts';
import { assertEquals } from '@std/assert';
import { AgeRating, Genre, Money, MovieDuration, MovieId, MovieTitle, PosterUrl } from '@/Domain/Ticketing/Movies/mod.ts';

Deno.test('[Unit] - MovieInfo - create - valid input - returns aggregate with value objects', () => {
    // Arrange
    const movieId = MovieId.create('991c1264-efc3-4eaa-8df3-4bb419a3b96f');
    const title = MovieTitle.create("Title of movie");
    const duration = MovieDuration.create(123);
    const genres = [ Genre.create("Animation"), Genre.create("Family") ];
    const posterUrl = PosterUrl.create("http://posterurl.jpg");
    const ageRating = AgeRating.create(12);
    const price = Money.create(0.15 * duration.value);

    // Act
    const movieInfo = MovieInfo.create(movieId, title, duration, genres, posterUrl, ageRating, price);

    // Assert
    assertEquals(movieInfo.movieId instanceof MovieId, true);
    assertEquals(movieInfo.title.value, title.value);
    assertEquals(movieInfo.duration.value, duration.value);
    assertEquals(movieInfo.genres.values, genres.values);
    assertEquals(movieInfo.posterUrl.value, posterUrl.value);
    assertEquals(movieInfo.ageRating.value, ageRating.value);
    assertEquals(movieInfo.price.value, price.value);
});

Deno.test('[Unit] - MovieInfo - equals - same movieId - returns true', () => {
    // Arrange
    const movieId1 = MovieId.create('991c1264-efc3-4eaa-8df3-4bb419a3b96f');
    const movieId2 = MovieId.create('991c1264-efc3-4eaa-8df3-4bb419a3b96f');
    const title = MovieTitle.create("Title of movie");
    const duration = MovieDuration.create(123);
    const genres = [ Genre.create("Animation"), Genre.create("Family") ];
    const posterUrl = PosterUrl.create("http://posterurl.jpg");
    const ageRating = AgeRating.create(12);
    const price = Money.create(0.15 * duration.value);
    
    // Act
    const left = MovieInfo.create(movieId1, title, duration, genres, posterUrl, ageRating, price);
    const right = MovieInfo.create(movieId2, title, duration, genres, posterUrl, ageRating, price);

    // Assert
    assertEquals(left.equals(right), true);
});

Deno.test('[Unit] - MovieInfo - equals - different movieId - returns false', () => {
    // Arrange
    const movieId1 = MovieId.create('991c1264-efc3-4eaa-8df3-4bb419a3b96f');
    const movieId2 = MovieId.create('991c1264-efc3-4eaa-8df3-4bb419a3b96e');
    const title = MovieTitle.create("Title of movie");
    const duration = MovieDuration.create(123);
    const genres = [ Genre.create("Animation"), Genre.create("Family") ];
    const posterUrl = PosterUrl.create("http://posterurl.jpg");
    const ageRating = AgeRating.create(12);
    const price = Money.create(0.15 * duration.value);
    
    // Act
    const left = MovieInfo.create(movieId1, title, duration, genres, posterUrl, ageRating, price);
    const right = MovieInfo.create(movieId2, title, duration, genres, posterUrl, ageRating, price);

    // Assert
    assertEquals(left.equals(right), false);
});