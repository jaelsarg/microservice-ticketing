import { MarkOrderAsPaidInput } from '@/Application/Ticketing/Orders/mod.ts';
import { UseCase } from '@/Application/Ports/mod.ts';
import { WhenPaymentSucceededThenMarkOrderAsPaid } from '@/Application/Ticketing/Payments/mod.ts';
import { PaymentSuccess } from '@/Domain/Ticketing/Payments/mod.ts';
import { assertEquals } from '@std/assert';

Deno.test('[Unit] - WhenPaymentSucceededThenMarkOrderAsPaid - handles event', async () => {
    // Arrange
    const calls: { input?: { orderId: string } } = {};
    const markOrder = {
        execute: async (input: { orderId: string }) => {
            calls.input = input;
        },
    } as UseCase<MarkOrderAsPaidInput, void>;

    const policy = new WhenPaymentSucceededThenMarkOrderAsPaid(markOrder);
    const event = PaymentSuccess.create('f2b248ae-7bac-4296-be01-d8250b034f55', 'f2b248ae-7bac-4296-be01-d8250b034f55', 'f2b248ae-7bac-4296-be01-d8250b034f55');

    // Act
    await policy.handle(event);
    
    // Assert
    assertEquals(calls.input, { orderId: 'f2b248ae-7bac-4296-be01-d8250b034f55' });
});