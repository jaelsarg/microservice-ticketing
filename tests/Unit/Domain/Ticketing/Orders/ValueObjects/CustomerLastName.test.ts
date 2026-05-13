import { CustomerLastName, InvalidCustomerLastNameException } from '@/Domain/Ticketing/Orders/mod.ts';
import { assertEquals, assertThrows } from '@std/assert';

Deno.test('[Unit] - CustomerLastName - create - valid value - returns CustomerLastName value object', () => {
    // Arrange
    const value = "Jerôme";

    // Act
    const firstName = CustomerLastName.create(value);

    // Assert
    assertEquals(firstName.value, value);
});

Deno.test('[Unit] - CustomerLastName - create - invalid value - throws InvalidCustomerLastNameException', () => {
    // Arrange
    const value = "";

    // Act & Assert
    assertThrows(
        () => CustomerLastName.create(value),
        InvalidCustomerLastNameException
    );
});

Deno.test('[Unit] - CustomerLastName - equals - same value - returns true', () => {
    // Arrange
    const left = CustomerLastName.create("Jerôme");
    const right = CustomerLastName.create("Jerôme");

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - CustomerLastName - equals - different value - returns false', () => {
    // Arrange
    const left = CustomerLastName.create("Jerôme");
    const right = CustomerLastName.create("Jerommeke");

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});