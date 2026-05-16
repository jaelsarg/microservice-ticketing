import { CardNumber, CVV, ExpiryDate, ExternalId, InvalidFailedReasonException, Payment, PaymentAmount, PaymentFailed, PaymentId, PaymentMethod, PaymentMethodType, PaymentSuccess } from '@/Domain/Ticketing/Payments/mod.ts';
import { BookingId, OrderId } from '@/Domain/Ticketing/Orders/mod.ts';
import { assertEquals } from '@std/assert/equals';
import { DomainEvent } from '@/Domain/Shared/mod.ts';
import { assertThrows } from '@std/assert/throws';

function expectSingleEvent<TEvent>(
  events: readonly DomainEvent[],
  ctor: { prototype: TEvent },
) {
  assertEquals(events.length, 1);
  assertEquals(events[0] instanceof (ctor as any), true);
  return events[0] as TEvent;
}

Deno.test('[Unit] - Payment - create - valid input - returns aggregate with value objects', () => {
    // Arrange
    const externalId = ExternalId.create('1fb29a10-4fe7-4e56-81c7-ba217e6f4159');
    const paymentMethod = PaymentMethod.create(PaymentMethodType.CreditCard);
    const cardNumber = CardNumber.create('4111111111111111');
    const expiryDate = ExpiryDate.create('12/30');
    const cvv = CVV.create('123');
    const orderId = OrderId.create('1fb29a10-4fe7-4e56-81c7-ba217e6f4159');
    const bookingId = BookingId.create('1fb29a10-4fe7-4e56-81c7-ba217e6f4159');
    const amount = PaymentAmount.create(100.00);

    // Act
    const payment = Payment.create(
        externalId,
        paymentMethod,
        cardNumber,
        expiryDate,
        cvv,
        orderId,
        bookingId,
        amount,
    );

    // Assert
    assertEquals(payment.id instanceof PaymentId, true);
    assertEquals(payment.externalId, externalId);
    assertEquals(payment.paymentMethod, paymentMethod);
    assertEquals(payment.cardNumber, cardNumber);
    assertEquals(payment.expiryDate, expiryDate);
    assertEquals(payment.cvv, cvv);
    assertEquals(payment.orderId, orderId);
    assertEquals(payment.bookingId, bookingId);
    assertEquals(payment.amount, amount);
    assertEquals(payment.status.value, 'Pending');
});

Deno.test('[Unit] - Payment - markAsSucceeded - transitions status to Success and raises PaymentSuccess event', () => {
    // Arrange
    const externalId = ExternalId.create('1fb29a10-4fe7-4e56-81c7-ba217e6f4159');
    const paymentMethod = PaymentMethod.create(PaymentMethodType.CreditCard);
    const cardNumber = CardNumber.create('4111111111111111');
    const expiryDate = ExpiryDate.create('12/30');
    const cvv = CVV.create('123');
    const orderId = OrderId.create('1fb29a10-4fe7-4e56-81c7-ba217e6f4159');
    const bookingId = BookingId.create('1fb29a10-4fe7-4e56-81c7-ba217e6f4159');
    const amount = PaymentAmount.create(100.00);
    const payment = Payment.create(
        externalId,
        paymentMethod,
        cardNumber,
        expiryDate,
        cvv,
        orderId,
        bookingId,
        amount,
    );

    // Act
    payment.markAsSucceeded();

    // Asserrt
    assertEquals(payment.status.value, 'Success');
    expectSingleEvent(payment.domainEvents, PaymentSuccess);
});

Deno.test('[Unit] - Payment - markAsFailed - valid input - transitions status to Failed and raises PaymentFailed event', () => {
    // Arrange
    const externalId = ExternalId.create('1fb29a10-4fe7-4e56-81c7-ba217e6f4159');
    const paymentMethod = PaymentMethod.create(PaymentMethodType.CreditCard);
    const cardNumber = CardNumber.create('4111111111111111');
    const expiryDate = ExpiryDate.create('12/30');
    const cvv = CVV.create('123');
    const orderId = OrderId.create('1fb29a10-4fe7-4e56-81c7-ba217e6f4159');
    const bookingId = BookingId.create('1fb29a10-4fe7-4e56-81c7-ba217e6f4159');
    const amount = PaymentAmount.create(100.00);
    const payment = Payment.create(
        externalId,
        paymentMethod,
        cardNumber,
        expiryDate,
        cvv,
        orderId,
        bookingId,
        amount,
    );

    const reason = 'Payment failed';

    // Act
    payment.markAsFailed(reason);

    // Asserrt
    assertEquals(payment.status.value, 'Failed');
    expectSingleEvent(payment.domainEvents, PaymentFailed);
});

Deno.test('[Unit] - Payment - markAsFailed - invalid input - throw InvalidFailedReasonException', () => {
    // Arrange
    const externalId = ExternalId.create('1fb29a10-4fe7-4e56-81c7-ba217e6f4159');
    const paymentMethod = PaymentMethod.create(PaymentMethodType.CreditCard);
    const cardNumber = CardNumber.create('4111111111111111');
    const expiryDate = ExpiryDate.create('12/30');
    const cvv = CVV.create('123');
    const orderId = OrderId.create('1fb29a10-4fe7-4e56-81c7-ba217e6f4159');
    const bookingId = BookingId.create('1fb29a10-4fe7-4e56-81c7-ba217e6f4159');
    const amount = PaymentAmount.create(100.00);
    const payment = Payment.create(
        externalId,
        paymentMethod,
        cardNumber,
        expiryDate,
        cvv,
        orderId,
        bookingId,
        amount,
    );

    const reason = '';

    // Act & Assert
    assertThrows(
        () => payment.markAsFailed(reason),
        InvalidFailedReasonException,
    );
});