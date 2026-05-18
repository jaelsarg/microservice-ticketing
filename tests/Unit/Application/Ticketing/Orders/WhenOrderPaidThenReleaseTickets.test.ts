import { UseCase } from '@/Application/Ports/mod.ts';
import { ReleaseTicketsInput, WhenOrderPaidThenReleaseTickets } from '@/Application/Ticketing/Orders/mod.ts';
import { OrderPaid } from '@/Domain/Ticketing/Orders/mod.ts';
import { assertEquals } from '@std/assert';

Deno.test('[Unit] - WhenOrderPaidThenReleaseTickets - handles event', async () => {
    // Arrange
    const calls: { input?: { orderId: string } } = {};
    const releaseTickets = {
        execute: async (input: { orderId: string }) => {
            calls.input = input;
        },
    } as UseCase<ReleaseTicketsInput, void>;



    const policy = new WhenOrderPaidThenReleaseTickets(releaseTickets);
    const event = OrderPaid.create('f2b248ae-7bac-4296-be01-d8250b034f55', 'f2b248ae-7bac-4296-be01-d8250b034f55');

    // Act
    await policy.handle(event);
    
    // Assert
    assertEquals(calls.input, { orderId: 'f2b248ae-7bac-4296-be01-d8250b034f55'});
});