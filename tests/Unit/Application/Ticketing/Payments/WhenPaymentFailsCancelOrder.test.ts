import { UseCase } from '@/Application/Ports/mod.ts';
import { CancelOrderInput } from '@/Application/Ticketing/Orders/mod.ts';
import { WhenPaymentFailedThenCancelOrder } from '@/Application/Ticketing/Payments/mod.ts';
import { PaymentFailed } from '@/Domain/Ticketing/Payments/mod.ts';
import { assertEquals } from '@std/assert';

Deno.test('[Unit] - WhenPaymentFailsCancelOrder - handles event', async () => {
    // Arrange
    const calls: { input?: { orderId: string } } = {};
    const cancelOrder = {
        execute: async (input: { orderId: string }) => {
            calls.input = input;
        },
    } as UseCase<CancelOrderInput, void>;

    const policy = new WhenPaymentFailedThenCancelOrder(cancelOrder);
    const event = PaymentFailed.create('f2b248ae-7bac-4296-be01-d8250b034f55', 'f2b248ae-7bac-4296-be01-d8250b034f55', 'f2b248ae-7bac-4296-be01-d8250b034f55', 'Reason');

    // Act
    await policy.handle(event);

    // Assert
    assertEquals(calls.input, { orderId: 'f2b248ae-7bac-4296-be01-d8250b034f55' });
});