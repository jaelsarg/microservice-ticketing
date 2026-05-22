import { CustomerInfoAdded, OrderPaid, TicketsReleased } from '@/Domain/Ticketing/Orders/mod.ts';
import { assertEquals } from '@std/assert/equals';

Deno.test('[Unit] - OrderPaid event - exposes data', () => {
    // Arrange
    const orderId = 'order-123';
    const bookingId = 'booking-456';

    // Act
    const event = OrderPaid.create(orderId, bookingId);

    // Assert
    assertEquals(event.orderId, orderId);
    assertEquals(event.bookingId, bookingId);
    assertEquals(event.FQDN.toString(), 'howestprime.ticketing.order.orderpaid');
    assertEquals(OrderPaid.FQDN.toString(), 'howestprime.ticketing.order.orderpaid');
    assertEquals(event.occurredOn instanceof Date, true);
});

Deno.test('[Unit] - TicketsReleased event - with customer - exposes data', () => {
    // Arrange
    const orderId = 'order-123';
    const customer = {
        salutation: 'Mr.',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
    };
    const tickets = [
        {
            ticketId: 'ticket-1',
            movieId: 'movie-123',
            room: 'Room A',
            seatNumber: 5,
            visitorType: 'Standard',
            price: 10.0,
            showtime: new Date('2024-07-01T20:00:00Z'),
        },
        {
            ticketId: 'ticket-2',
            movieId: 'movie-123',
            room: 'Room A',
            seatNumber: 6,
            visitorType: 'Discount',
            price: 8.0,
            showtime: new Date('2024-07-01T20:00:00Z'),
        }
    ];

    // Act
    const event = TicketsReleased.create(orderId, tickets, customer);

    // Assert
    assertEquals(event.orderId, orderId);
    assertEquals(event.customer, customer);
    assertEquals(event.tickets, tickets);
    assertEquals(event.FQDN.toString(), 'howestprime.ticketing.order.ticketsreleased');
    assertEquals(TicketsReleased.FQDN.toString(), 'howestprime.ticketing.order.ticketsreleased');
    assertEquals(event.occurredOn instanceof Date, true);
});

Deno.test('[Unit] - TicketsReleased event - without customer - exposes data', () => {
    // Arrange
    const orderId = 'order-123';
    const tickets = [
        {
            ticketId: 'ticket-1',
            movieId: 'movie-123',
            room: 'Room A',
            seatNumber: 5,
            visitorType: 'Standard',
            price: 10.0,
            showtime: new Date('2024-07-01T20:00:00Z'),
        },
        {
            ticketId: 'ticket-2',
            movieId: 'movie-123',
            room: 'Room A',
            seatNumber: 6,
            visitorType: 'Discount',
            price: 8.0,
            showtime: new Date('2024-07-01T20:00:00Z'),
        }
    ];

    // Act
    const event = TicketsReleased.create(orderId, tickets);

    // Assert
    assertEquals(event.orderId, orderId);
    assertEquals(event.tickets, tickets);
    assertEquals(event.FQDN.toString(), 'howestprime.ticketing.order.ticketsreleased');
    assertEquals(TicketsReleased.FQDN.toString(), 'howestprime.ticketing.order.ticketsreleased');
    assertEquals(event.occurredOn instanceof Date, true);
})

Deno.test('[Unit] - CustomerInfoAdded - exposes data', () => {
    // Arrange
    const orderId = 'order-123';
    const salutation = 'Ms.';
    const firstName = 'Jane';
    const lastName = 'Smith';
    const email = 'jane.smith@example.com';

    // Act
    const event = CustomerInfoAdded.create(orderId, salutation, firstName, lastName, email);

    // Assert
    assertEquals(event.orderId, orderId);
    assertEquals(event.salutation, salutation);
    assertEquals(event.firstName, firstName);
    assertEquals(event.lastName, lastName);
    assertEquals(event.email, email);
    assertEquals(event.FQDN.toString(), 'howestprime.ticketing.order.customerinfoadded');
    assertEquals(CustomerInfoAdded.FQDN.toString(), 'howestprime.ticketing.order.customerinfoadded');
    assertEquals(event.occurredOn instanceof Date, true);
});