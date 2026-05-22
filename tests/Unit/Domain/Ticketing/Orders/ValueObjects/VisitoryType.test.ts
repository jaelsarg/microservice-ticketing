import { assertEquals } from '@std/assert';
import { VisitorType, VisitorTypeState } from '@/Domain/Ticketing/Orders/mod.ts';

Deno.test('[Unit] - VisitorType - create - valid value - returns VisitorType value object', () => {
    // Arrange
    const value = VisitorTypeState.Standard;

    // Act
    const visitorType = VisitorType.create(value);

    // Assert
    assertEquals(visitorType.value, value);
});

Deno.test('[Unit] - VisitorType - equals - same value - returns true', () => {
    // Arrange
    const left = VisitorType.create(VisitorTypeState.Standard);
    const right = VisitorType.create(VisitorTypeState.Standard);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - VisitorType - equals - different value - returns false', () => {
    // Arrange
    const left = VisitorType.create(VisitorTypeState.Standard);
    const right = VisitorType.create(VisitorTypeState.Discount);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});

Deno.test('[Unit] - VisitorType - equals - null - returns false', () => {
    // Arrange
    const left = VisitorType.create(VisitorTypeState.Standard);
    const right = null as unknown as VisitorType;

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});