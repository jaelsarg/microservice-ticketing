import { assertEquals, assertThrows } from '@std/assert';
import { EmptyExpiryDateException, ExpiryDate, InvalidExpiryDateException, InvalidExpiryDateFormatException } from '@/Domain/Ticketing/Payments/mod.ts';

Deno.test('[Unit] - ExpiryDate - create - valid value - returns ExpiryDate value object', () => {
    // Arrange
    const value = '12/25';

    // Act
    const expiryDate = ExpiryDate.create(value);

    // Assert
    assertEquals(expiryDate.value, value);
});

Deno.test('[Unit] - ExpiryDate - create - invalid value - throws EmptyExpiryDateException', () => {
    // Arrange
    const value = '';

    // Act & Assert
    assertThrows(
        () => ExpiryDate.create(value),
        EmptyExpiryDateException
    );
});

Deno.test('[Unit] - ExpiryDate - create - invalid pattern - throws InvalidExpiryDateFormatException', () => {
    // Arrange
    const value = 'invalid_pattern';

    // Act & Assert
    assertThrows(
        () => ExpiryDate.create(value),
        InvalidExpiryDateFormatException
    );
});

Deno.test('[Unit] - ExpiryDate - create - invalid month - throws InvalidExpiryDateException', () => {
    // Arrange
    const value = '13/25';

    // Act & Assert
    assertThrows(
        () => ExpiryDate.create(value),
        InvalidExpiryDateException
    );
});

Deno.test('[Unit] - ExpiryDate - equals - same value - returns true', () => {
    // Arrange
    const left = ExpiryDate.create('12/25');
    const right = ExpiryDate.create('12/25');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - ExpiryDate - equals - different value - returns false', () => {
    // Arrange
    const left = ExpiryDate.create('12/25');
    const right = ExpiryDate.create('12/26');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});