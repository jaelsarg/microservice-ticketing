import { InvalidStatusTransitionError, OrderStatus, OrderStatusState } from '@/Domain/Ticketing/Orders/mod.ts';
import { assertEquals, assertThrows } from '@std/assert';

Deno.test('[Unit] - OrderStatus - create - valid value - returns OrderStatus value object', () => {
    // Arrange
    const value = OrderStatusState.Open;

    // Act
    const orderStatus = OrderStatus.create(value);

    // Assert
    assertEquals(orderStatus.value, value);
});

Deno.test('[Unit] - OrderStatus - equals - same value - returns true', () => {
    // Arrange
    const left = OrderStatus.create(OrderStatusState.Open);
    const right = OrderStatus.create(OrderStatusState.Open);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - OrderStatus - equals - different value - returns false', () => {
    // Arrange
    const left = OrderStatus.create(OrderStatusState.Open);
    const right = OrderStatus.create(OrderStatusState.Cancelled);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});

Deno.test('[Unit] - OrderStatus - equals - null - returns false', () => {
    // Arrange
    const left = OrderStatus.create(OrderStatusState.Open);
    const right = null as unknown as OrderStatus;

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});

Deno.test('[Unit] - OrderStatus - transitionTo - valid transition - should transition', () => {
    // Arrange
    const orderStatus = OrderStatus.create(OrderStatusState.Open);

    // Act
    const result = orderStatus.transitionTo(OrderStatus.Paid);

    // Assert
    assertEquals(result.value, OrderStatusState.Paid);
});

Deno.test('[Unit] - OrderStatus - transitionTo - invalid transition - should transition', () => {
    // Arrange
    const orderStatus = OrderStatus.create(OrderStatusState.Paid);

    // Act & Assert
    assertThrows(
        () => orderStatus.transitionTo(OrderStatus.Open),
        InvalidStatusTransitionError
    );
});