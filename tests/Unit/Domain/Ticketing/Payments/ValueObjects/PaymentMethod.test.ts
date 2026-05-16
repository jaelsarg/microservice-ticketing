import { PaymentMethod, PaymentMethodType } from '@/Domain/Ticketing/Payments/mod.ts';
import { assertEquals } from '@std/assert';

Deno.test('[Unit] - PaymentMethod - create - valid value - returns PaymentMethod value object', () => {
    // Arrange
    const value = PaymentMethodType.CreditCard;

    // Act
    const paymentMethod = PaymentMethod.create(value);

    // Assert
    assertEquals(paymentMethod.value, value);
});

Deno.test('[Unit] - PaymentMethod - equals - same value - returns true', () => {
    // Arrange
    const left = PaymentMethod.create(PaymentMethodType.CreditCard);
    const right = PaymentMethod.create(PaymentMethodType.CreditCard);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - PaymentMethod - equals - different value - returns false', () => {
    // Arrange
    const left = PaymentMethod.create(PaymentMethodType.CreditCard);
    const right = PaymentMethod.create(PaymentMethodType.BankTransfer);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});