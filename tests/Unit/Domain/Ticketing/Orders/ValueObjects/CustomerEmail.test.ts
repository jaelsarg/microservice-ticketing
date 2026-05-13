import { CustomerEmail, EmailEmptyException, InvalidEmailFormatException } from '@/Domain/Ticketing/Orders/mod.ts';
import { assertEquals, assertThrows } from '@std/assert';

Deno.test('[Unit] - CustomerEmail - create - valid value - returns CustomerEmail value object', () => {
    // Arrange
    const value = "jerome.hendryckx@email.com";

    // Act
    const customerEmail = CustomerEmail.create(value);

    // Assert
    assertEquals(customerEmail.value, value);
});

Deno.test('[Unit] - CustomerEmail - create - invalid value - throws EmailEmptyException', () => {
    // Arrange
    const value = "";

    // Act & Assert
    assertThrows(
        () => CustomerEmail.create(value),
        EmailEmptyException
    );
});

Deno.test('[Unit] - CustomerEmail - create - invalid valuetype - throws InvalidEmailFormatException', () => {
    // Arrange
    const value = "test";

    // Act & Assert
    assertThrows(
        () => CustomerEmail.create(value),
        InvalidEmailFormatException
    );
});

Deno.test('[Unit] - CustomerEmail - equals - same value - returns true', () => {
    // Arrange
    const left = CustomerEmail.create("jerome.hendryckx@email.com");
    const right = CustomerEmail.create("jerome.hendryckx@email.com");

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - CustomerEmail - equals - different value - returns false', () => {
    // Arrange
    const left = CustomerEmail.create("jerome.hendryckx@email.com");
    const right = CustomerEmail.create("jerommeke.hendryckx@email.com");

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});