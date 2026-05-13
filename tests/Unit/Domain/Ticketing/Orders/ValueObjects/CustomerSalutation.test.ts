import { CustomerSalutation } from '@/Domain/Ticketing/Orders/mod.ts';
import { assertEquals } from '@std/assert';
import { CustomerSalutationType } from '@/Domain/Ticketing/Orders/ValueObjects/CustomerSalutation.ts';

Deno.test('[Unit] - CustomerSalutation - create - valid value - returns CustomerSalutation value object', () => {
    // Arrange
    const value = CustomerSalutationType.Mr;

    // Act
    const salutation = CustomerSalutation.create(value);

    // Assert
    assertEquals(salutation.value, value);
});

Deno.test('[Unit] - CustomerSalutation - equals - same value - returns true', () => {
    // Arrange
    const left = CustomerSalutation.create(CustomerSalutationType.Mr);
    const right = CustomerSalutation.create(CustomerSalutationType.Mr);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - CustomerSalutation - equals - different value - returns false', () => {
    // Arrange
    const left = CustomerSalutation.create(CustomerSalutationType.Mr);
    const right = CustomerSalutation.create(CustomerSalutationType.Ms);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});