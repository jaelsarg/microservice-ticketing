import { InvalidPosterUrlException, PosterUrl } from '@/Domain/Ticketing/Movies/mod.ts';
import { assertEquals, assertThrows } from '@std/assert';

Deno.test('[Unit] - PosterUrl - create - valid value - returns PosterUrl value object', () => {
    // Arrange
    const validPosterUrl = "https://example.com/poster.jpg";

    // Act
    const posterUrl = PosterUrl.create(validPosterUrl);

    // Assert
    assertEquals(posterUrl.value, validPosterUrl);
});

Deno.test('[Unit] - PosterUrl - create - invalid value - throws InvalidPosterUrlException', () => {
    // Arrange
    const invalidPosterUrl = "";

    // Act & Assert
    assertThrows(
        () => PosterUrl.create(invalidPosterUrl),
        InvalidPosterUrlException
    );
});

Deno.test('[Unit] - PosterUrl - create - invalid protocol - throws InvalidPosterUrlException', () => {
    // Arrange
    const invalidPosterUrl = "ftp://example.com/poster.jpg";

    // Act & Assert
    assertThrows(
        () => PosterUrl.create(invalidPosterUrl),
        InvalidPosterUrlException
    );
});

Deno.test('[Unit] - PosterUrl - equals - same value - returns true', () => {
    // Arrange
    const left = PosterUrl.create("https://example.com/poster1.jpg");
    const right = PosterUrl.create("https://example.com/poster1.jpg");

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - PosterUrl - equals - different value - returns false', () => {
    // Arrange
    const left = PosterUrl.create("https://example.com/poster1.jpg");
    const right = PosterUrl.create("https://example.com/poster2.jpg");

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});