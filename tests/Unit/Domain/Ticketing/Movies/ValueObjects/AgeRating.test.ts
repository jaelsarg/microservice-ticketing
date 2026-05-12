import { AgeRating, InvalidAgeRatingException } from '@/Domain/Ticketing/Movies/mod.ts';
import { assertEquals, assertThrows } from '@std/assert';

Deno.test('[Unit] - AgeRating - create - valid value - returns AgeRating value object', () => {
    // Arrange
    const validAgeRating = 12;

    // Act
    const ageRating = AgeRating.create(validAgeRating);

    // Assert
    assertEquals(ageRating.value, validAgeRating);
});

Deno.test('[Unit] - AgeRating - create - invalid value - throws InvalidAgeRatingException', () => {
    // Arrange
    const invalidAgeRating = -12;

    // Act & Assert
    assertThrows(
        () => AgeRating.create(invalidAgeRating),
        InvalidAgeRatingException
    );
});

Deno.test('[Unit] - AgeRating - equals - same value - returns true', () => {
    // Arrange
    const left = AgeRating.create(12);
    const right = AgeRating.create(12);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - AgeRating - equals - different value - returns false', () => {
    // Arrange
    const left = AgeRating.create(12);
    const right = AgeRating.create(16);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});