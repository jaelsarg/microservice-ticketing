import { MovieInfo, MovieInfoId } from '@/Domain/Ticketing/Orders/mod.ts';
import { assertEquals } from '@std/assert';
import { AgeRating, Genre, Money, MovieDuration, MovieTitle, PosterUrl } from '@/Domain/Ticketing/Movies/mod.ts';

Deno.test('[Unit] - MovieInfo - create - valid input - returns aggregate with value objects', () => {
    // Arrange
    const title = MovieTitle.create("Title of movie");
    const duration = MovieDuration.create(123);
    const genres = [ Genre.create("Animation"), Genre.create("Family") ];
    const posterUrl = PosterUrl.create("http://posterurl.jpg");
    const ageRating = AgeRating.create(12);
    const price = Money.create(0.15 * duration.value);

    // Act
    const movieInfo = MovieInfo.create(title, duration, genres, posterUrl, ageRating, price);

    // Assert
    assertEquals(movieInfo.id instanceof MovieInfoId, true);
    assertEquals(movieInfo.title.value, title.value);
    assertEquals(movieInfo.duration.value, duration.value);
    assertEquals(movieInfo.genres.values, genres.values);
    assertEquals(movieInfo.posterUrl.value, posterUrl.value);
    assertEquals(movieInfo.ageRating.value, ageRating.value);
    assertEquals(movieInfo.price.value, price.value);
});