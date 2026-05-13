import { InvalidSeatNumberException, Seat, VisitorType, VisitorTypeState } from '@/Domain/Ticketing/Orders/mod.ts';
import { assertEquals, assertThrows } from '@std/assert';

Deno.test('[Unit] - Seat - create - valid value - returns Seat value object', () => {
    // Arrange
    const seatNumber = 12;
    const visitorType = VisitorType.create(VisitorTypeState.Standard);

    // Act
    const seat = Seat.create(seatNumber, visitorType);

    // Assert
    assertEquals(seat.seatNumber, seatNumber);
    assertEquals(seat.visitorType, visitorType);
});

Deno.test('[Unit] - Seat - create - invalid seatNumber - throws InvalidSeatNumberException', () => {
    // Arrange
    const seatNumber = -12;
    const visitorType = VisitorType.create(VisitorTypeState.Standard);

    // Act & Assert
    assertThrows(
        () => Seat.create(seatNumber, visitorType),
        InvalidSeatNumberException
    );
});

Deno.test('[Unit] - Seat - equals - same value - returns true', () => {
    // Arrange
    const left = Seat.create(12, VisitorType.create(VisitorTypeState.Standard));
    const right = Seat.create(12, VisitorType.create(VisitorTypeState.Standard));

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - Seat - equals - different value - returns false', () => {
    // Arrange
    const left = Seat.create(12, VisitorType.create(VisitorTypeState.Standard));
    const right = Seat.create(16, VisitorType.create(VisitorTypeState.Standard));

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});