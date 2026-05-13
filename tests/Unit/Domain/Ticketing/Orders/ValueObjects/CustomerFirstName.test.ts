import { CustomerFirstName, InvalidCustomerFirstNameException } from '@/Domain/Ticketing/Orders/mod.ts';
import { assertEquals, assertThrows } from '@std/assert';

Deno.test('[Unit] - CustomerFirstName - create - valid value - returns CustomerFirstName value object', () => {
    // Arrange
    const value = "Jerôme";

    // Act
    const firstName = CustomerFirstName.create(value);

    // Assert
    assertEquals(firstName.value, value);
});

Deno.test('[Unit] - CustomerFirstName - create - invalid value - throws InvalidCustomerFirstNameException', () => {
    // Arrange
    const value = "";

    // Act & Assert
    assertThrows(
        () => CustomerFirstName.create(value),
        InvalidCustomerFirstNameException
    );
});

Deno.test('[Unit] - CustomerFirstName - equals - same value - returns true', () => {
    // Arrange
    const left = CustomerFirstName.create("Jerôme");
    const right = CustomerFirstName.create("Jerôme");

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - CustomerFirstName - equals - different value - returns false', () => {
    // Arrange
    const left = CustomerFirstName.create("Jerôme");
    const right = CustomerFirstName.create("Jerommeke");

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});