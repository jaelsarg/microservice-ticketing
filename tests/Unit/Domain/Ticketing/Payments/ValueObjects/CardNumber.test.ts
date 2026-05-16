import { CardNumber, InvalidCardNumberException } from '@/Domain/Ticketing/Payments/mod.ts';
import { assertEquals, assertThrows } from '@std/assert';

Deno.test('[Unit] - CardNumber - create - valid value - returns CardNumber value object', () => {
    // Arrange
    const value = '4111111111111111';

    // Act
    const cardNumber = CardNumber.create(value);

    // Assert
    assertEquals(cardNumber.value, value);
});

Deno.test('[Unit] - CardNumber - create - invalid value - throws InvalidCardNumberException', () => {
    // Arrange
    const value = '';

    // Act & Assert
    assertThrows(
        () => CardNumber.create(value),
        InvalidCardNumberException
    );
});

Deno.test('[Unit] - CardNumber - equals - same value - returns true', () => {
    // Arrange
    const left = CardNumber.create('4111111111111111');
    const right = CardNumber.create('4111111111111111');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - CardNumber - equals - different value - returns false', () => {
    // Arrange
    const left = CardNumber.create('4111111111111111');
    const right = CardNumber.create('4222222222222222');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});