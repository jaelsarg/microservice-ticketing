import { InvalidMovieTitleException, MovieTitle } from '@/Domain/Ticketing/Movies/mod.ts';
import { assertEquals, assertThrows } from '@std/assert';

Deno.test('[Unit] - MovieTitle - create - valid value - returns MovieTitle value object', () => {
    // Arrange
    const validMovieTitle = "The Matrix";

    // Act
    const movieTitle = MovieTitle.create(validMovieTitle);

    // Assert
    assertEquals(movieTitle.value, validMovieTitle);
});

Deno.test('[Unit] - MovieTitle - create - invalid value - throws InvalidMovieTitleException', () => {
    // Arrange
    const invalidMovieTitle = "";

    // Act & Assert
    assertThrows(
        () => MovieTitle.create(invalidMovieTitle),
        InvalidMovieTitleException
    );
});

Deno.test('[Unit] - MovieTitle - equals - same value - returns true', () => {
    // Arrange
    const left = MovieTitle.create("The Matrix");
    const right = MovieTitle.create("The Matrix");

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - MovieTitle - equals - different value - returns false', () => {
    // Arrange
    const left = MovieTitle.create("The Matrix");
    const right = MovieTitle.create("Inception");

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});