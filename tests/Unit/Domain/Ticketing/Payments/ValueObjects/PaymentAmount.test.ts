import { InvalidPaymentAmountException, PaymentAmount } from '@/Domain/Ticketing/Payments/mod.ts';
import { assertEquals, assertThrows } from '@std/assert';

Deno.test('[Unit] - PaymentAmount - create - valid value - returns PaymentAmount value object', () => {
    // Arrange
    const value = 100.00;

    // Act
    const paymentAmount = PaymentAmount.create(value);

    // Assert
    assertEquals(paymentAmount.value, value);
});

Deno.test('[Unit] - PaymentAmount - create - invalid value - throws InvalidPaymentAmountException', () => {
    // Arrange
    const value = -100.00;

    // Act & Assert
    assertThrows(
        () => PaymentAmount.create(value),
        InvalidPaymentAmountException
    );
});

Deno.test('[Unit] - PaymentAmount - equals - same value - returns true', () => {
    // Arrange
    const left = PaymentAmount.create(100.00);
    const right = PaymentAmount.create(100.00);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - PaymentAmount - equals - different value - returns false', () => {
    // Arrange
    const left = PaymentAmount.create(100.00);
    const right = PaymentAmount.create(200.00);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});