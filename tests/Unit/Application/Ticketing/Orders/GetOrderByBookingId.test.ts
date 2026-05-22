import { GetOrderByBookingIdQuery, OrderData } from '@/Application/Ports/Queries/mod.ts';
import { Optional } from '@domaincrafters/std';
import { GetOrderByBookingId, GetOrderByBookingIdInput, OrderByIdNotFoundApplicationException } from '@/Application/Ticketing/Orders/mod.ts';
import { assertEquals } from '@std/assert/equals';
import { assertRejects } from '@std/assert';

Deno.test('[Unit] - GetOrderByBookingId - valid input - returns order', async () => {
    // Arrange
    const data: OrderData = {
        id: '550e8400-e29b-41d4-a716-446655440200',
        bookingId: '9e5ad90d-1df6-4295-ad7c-a19950ab5daf',
        status: 'open',
        price: 25.00,
        agreeToTerms: true,
        customer: {
            salutation: 'Mr.',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com'
        },
        tickets: [
            {
                id: '660e8400-e29b-41d4-a716-446655440200',
                seatNumber: 1,
                visitorType: 'Standard',
                price: 12.50,
                movieId: '770e8400-e29b-41d4-a716-446655440200',
                room: 'Blue room',
                showTime: new Date('2024-07-01T19:00:00Z')
            },
            {
                id: '770e8400-e29b-41d4-a716-446655440200',
                seatNumber: 2,
                visitorType: 'Discount',
                price: 12.50,
                movieId: '770e8400-e29b-41d4-a716-446655440200',
                room: 'Blue room',
                showTime: new Date('2024-07-01T19:00:00Z')
            }
        ]
    };

    const query: GetOrderByBookingIdQuery = {
        fetch: (_id) => Promise.resolve(Optional.of<OrderData>(data))
    };

    const useCase = new GetOrderByBookingId(query);

    const input: GetOrderByBookingIdInput = {
        bookingId: '9e5ad90d-1df6-4295-ad7c-a19950ab5daf'
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    assertEquals(result.id, data.id);
    assertEquals(result.bookingId, data.bookingId);
    assertEquals(result.status, data.status);
    assertEquals(result.price, data.price);
    assertEquals(result.agreeToTerms, data.agreeToTerms);
    assertEquals(result.customer, data.customer);
    assertEquals(result.tickets, data.tickets);
});

Deno.test('[Unit] - GetOrderByBookingId - non-existent booking ID - throws exception', async () => {
    // Arrange
    const query: GetOrderByBookingIdQuery = {
        fetch: (_id) => Promise.resolve(Optional.empty<OrderData>())
    };

    const useCase = new GetOrderByBookingId(query);

    const input: GetOrderByBookingIdInput = {
        bookingId: '74dee10e-dbe8-47f2-b77f-6f5c147512c4'
    };

    // Act & Assert
    await assertRejects(
        () => useCase.execute(input),
        OrderByIdNotFoundApplicationException
    );
});