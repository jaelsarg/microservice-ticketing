import { InvalidMovieDurationException, MovieDuration } from '@/Domain/Ticketing/Movies/mod.ts';
import { assertEquals, assertThrows } from '@std/assert';

Deno.test('[Unit] - MovieDuration - create - valid value; <100 - returns MovieDuration value object', () => {
    // Arrange
    const validMovieDuration = 12;

    // Act
    const movieDuration = MovieDuration.create(validMovieDuration);

    // Assert
    assertEquals(movieDuration.value, validMovieDuration);
});

Deno.test('[Unit] - MovieDuration - create - valid value; >100 - returns MovieDuration value object', () => {
    // Arrange
    const validMovieDuration = 101;

    // Act
    const movieDuration = MovieDuration.create(validMovieDuration);

    // Assert
    assertEquals(movieDuration.value, 111);
});

Deno.test('[Unit] - MovieDuration - create - invalid value - throws InvalidMovieDurationException', () => {
    // Arrange
    const invalidMovieDuration = -12;

    // Act & Assert
    assertThrows(
        () => MovieDuration.create(invalidMovieDuration),
        InvalidMovieDurationException
    );
});

Deno.test('[Unit] - MovieDuration - equals - same value - returns true', () => {
    // Arrange
    const left = MovieDuration.create(12);
    const right = MovieDuration.create(12);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - MovieDuration - equals - different value - returns false', () => {
    // Arrange
    const left = MovieDuration.create(12);
    const right = MovieDuration.create(16);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});