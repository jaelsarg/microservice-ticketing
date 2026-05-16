import { assertEquals, assertThrows } from '@std/assert';
import { CVV, EmptyCVVException, InvalidCVVException } from '@/Domain/Ticketing/Payments/mod.ts';

Deno.test('[Unit] - CVV - create - valid value - returns CVV value object', () => {
    // Arrange
    const value = '123';

    // Act
    const cvv = CVV.create(value);

    // Assert
    assertEquals(cvv.value, value);
});

Deno.test('[Unit] - CVV - create - empty value - throws EmptyCVVException', () => {
    // Arrange
    const value = '';

    // Act & Assert
    assertThrows(
        () => CVV.create(value),
        EmptyCVVException
    );
});

Deno.test('[Unit] - CVV - create - invalid value - throws InvalidCVVException', () => {
    // Arrange
    const value = '1234567';

    // Act & Assert
    assertThrows(
        () => CVV.create(value),
        InvalidCVVException
    );
});

Deno.test('[Unit] - CVV - equals - same value - returns true', () => {
    // Arrange
    const left = CVV.create('123');
    const right = CVV.create('123');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - CVV - equals - different value - returns false', () => {
    // Arrange
    const left = CVV.create('123');
    const right = CVV.create('456');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});