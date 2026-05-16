import { InvalidPaymentStatusTransitionException, PaymentStatus, PaymentStatusState } from '@/Domain/Ticketing/Payments/mod.ts';
import { assertEquals, assertThrows } from '@std/assert';

Deno.test('[Unit] - PaymentStatus - create - valid value - returns PaymentStatus value object', () => {
    // Arrange
    const value = PaymentStatusState.Pending;

    // Act
    const paymentStatus = PaymentStatus.create(value);

    // Assert
    assertEquals(paymentStatus.value, value);
});

Deno.test('[Unit] - PaymentStatus - equals - same value - returns true', () => {
    // Arrange
    const left = PaymentStatus.create(PaymentStatusState.Pending);
    const right = PaymentStatus.create(PaymentStatusState.Pending);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - PaymentStatus - equals - different value - returns false', () => {
    // Arrange
    const left = PaymentStatus.create(PaymentStatusState.Pending);
    const right = PaymentStatus.create(PaymentStatusState.Success);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});

Deno.test('[Unit] - PaymentStatus - transitionTo - valid transition - returns new PaymentStatus', () => {
    // Arrange
    const paymentStatus = PaymentStatus.create(PaymentStatusState.Pending);

    // Act
    const result = paymentStatus.transitionTo(PaymentStatus.create(PaymentStatusState.Success));

    // Assert
    assertEquals(result.value, PaymentStatusState.Success);
});

Deno.test('[Unit] - PaymentStatus - transitionTo - invalid transition - throws Error', () => {
    // Arrange
    const paymentStatus = PaymentStatus.create(PaymentStatusState.Failed);

    // Act & Assert
    assertThrows(
        () => paymentStatus.transitionTo(PaymentStatus.create(PaymentStatusState.Success)),
        InvalidPaymentStatusTransitionException,
    );

});