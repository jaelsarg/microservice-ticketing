import { Genre, InvalidGenreException } from '@/Domain/Ticketing/Movies/mod.ts';
import { assertEquals, assertThrows } from '@std/assert';

Deno.test('[Unit] - Genre - create - valid value - returns Genre value object', () => {
    // Arrange
    const validGenre = "Action";

    // Act
    const genre = Genre.create(validGenre);

    // Assert
    assertEquals(genre.value, validGenre);
});

Deno.test('[Unit] - Genre - create - invalid value - throws InvalidGenreException', () => {
    // Arrange
    const invalidGenre = "";

    // Act & Assert
    assertThrows(
        () => Genre.create(invalidGenre),
        InvalidGenreException
    );
});

Deno.test('[Unit] - Genre - equals - same value - returns true', () => {
    // Arrange
    const left = Genre.create("Action");
    const right = Genre.create("Action");

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - Genre - equals - different value - returns false', () => {
    // Arrange
    const left = Genre.create("Action");
    const right = Genre.create("Comedy");

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});