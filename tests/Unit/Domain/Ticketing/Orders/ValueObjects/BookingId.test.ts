import { assertEquals, assertThrows } from '@std/assert';
import { BookingId, InvalidBookingIdException } from '@/Domain/Ticketing/Orders/mod.ts';

Deno.test('[Unit] - BookingId - create - valid value - returns BookingId value object', () => {
    // Arrange
    const value = "12345678973b2dc77-6333-4152-be4a-33aba57d1041";

    // Act
    const bookingId = BookingId.create(value);

    // Assert
    assertEquals(bookingId.value, value);
});

Deno.test('[Unit] - BookingId - create - invalid value - throws InvalidBookingIdException', () => {
    // Arrange
    const value = "";

    // Act & Assert
    assertThrows(
        () => BookingId.create(value),
        InvalidBookingIdException
    );
});

Deno.test('[Unit] - BookingId - equals - same value - returns true', () => {
    // Arrange
    const left = BookingId.create("12345678973b2dc77-6333-4152-be4a-33aba57d1041");
    const right = BookingId.create("12345678973b2dc77-6333-4152-be4a-33aba57d1041");

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - BookingId - equals - different value - returns false', () => {
    // Arrange
    const left = BookingId.create("12345678973b2dc77-6333-4152-be4a-33aba57d1041");
    const right = BookingId.create("98765432109876543-3210-4321-cb98-765432109876");

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});