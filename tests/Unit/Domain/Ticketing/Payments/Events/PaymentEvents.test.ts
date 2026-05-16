import { assertEquals } from '@std/assert/equals';
import { PaymentFailed, PaymentId, PaymentSuccess } from '@/Domain/Ticketing/Payments/mod.ts';
import { BookingId, OrderId } from '@/Domain/Ticketing/Orders/mod.ts';

Deno.test('[Unit] - PaymentSuccess event - exposes data', () => {
    // Arrange
    const paymentId = PaymentId.create('1fb29a10-4fe7-4e56-81c7-ba217e6f4159');
    const orderId = OrderId.create('1fb29a10-4fe7-4e56-81c7-ba217e6f4159');
    const bookingId = BookingId.create('1fb29a10-4fe7-4e56-81c7-ba217e6f4159');

    // Act
    const event = PaymentSuccess.create(paymentId.value, orderId.value, bookingId.value);

    // Assert
    assertEquals(event.paymentId, paymentId.value);
    assertEquals(event.orderId, orderId.value);
    assertEquals(event.bookingId, bookingId.value);
    assertEquals(event.FQDN.toString(), 'howestprime.ticketing.payment.paymentsuccess');
    assertEquals(PaymentSuccess.FQDN.toString(), 'howestprime.ticketing.payment.paymentsuccess');
    assertEquals(event.occurredOn instanceof Date, true);
});

Deno.test('[Unit] - PaymentFailed event - exposes data', () => {
    // Arrange
    const paymentId = PaymentId.create('1fb29a10-4fe7-4e56-81c7-ba217e6f4159');
    const orderId = OrderId.create('1fb29a10-4fe7-4e56-81c7-ba217e6f4159');
    const bookingId = BookingId.create('1fb29a10-4fe7-4e56-81c7-ba217e6f4159');
    const failedReason = 'Insufficient funds';

    // Act
    const event = PaymentFailed.create(paymentId.value, orderId.value, bookingId.value, failedReason);

    // Assert
    assertEquals(event.paymentId, paymentId.value);
    assertEquals(event.orderId, orderId.value);
    assertEquals(event.bookingId, bookingId.value);
    assertEquals(event.failedReason, failedReason);
    assertEquals(event.FQDN.toString(), 'howestprime.ticketing.payment.paymentfailed');
    assertEquals(PaymentFailed.FQDN.toString(), 'howestprime.ticketing.payment.paymentfailed');
    assertEquals(event.occurredOn instanceof Date, true);
});