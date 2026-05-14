import { BookingId, Customer, CustomerEmail, CustomerFirstName, CustomerLastName, CustomerSalutation, CustomerSalutationType, InvalidOrderStatusException, MovieInfo, Order, OrderId, OrderStatus, OrderStatusState, Seat, TermsNotAcceptedException, Ticket, VisitorType } from '@/Domain/Ticketing/Orders/mod.ts';
import { AgeRating, Genre, Money, MovieDuration, MovieId, MovieTitle, PosterUrl } from '@/Domain/Ticketing/Movies/mod.ts';
import { assertEquals, assertThrows } from '@std/assert';
import { InvalidTicketAmountException } from '@/Domain/Ticketing/Orders/OrderExceptions.ts';
import { VisitorTypeState } from '@/Domain/Ticketing/Orders/ValueObjects/VisitorType.ts';

const createTickets = () =>
  [
    Ticket.create(
        MovieInfo.create(MovieId.create('991c1264-efc3-4eaa-8df3-4bb419a3b96f'), MovieTitle.create('Test Movie'), MovieDuration.create(123), [ Genre.create('Action'), Genre.create('Adventure') ], PosterUrl.create('http://posterurl.jpg'), AgeRating.create(12), Money.create(0.15 * 123)),
        Seat.create(12, VisitorType.create(VisitorTypeState.Standard)),
        'Blue Room',
        new Date('2026-05-15T19:00:00Z')
    ),
    Ticket.create(
        MovieInfo.create(MovieId.create('4442d8e5-f939-4f07-9b14-aa83f49d0d34'), MovieTitle.create('Test Movie 2'), MovieDuration.create(123), [ Genre.create('Action'), Genre.create('Adventure') ], PosterUrl.create('http://posterurl.jpg'), AgeRating.create(12), Money.create(0.15 * 123)),
        Seat.create(12, VisitorType.create(VisitorTypeState.Discounted)),
        'Blue Room',
        new Date('2026-05-15T19:00:00Z')
    )
  ]

Deno.test('[Unit] - Order - create - valid input - returns aggregate with value objects', () => {
    // Arrange
    const bookingId = BookingId.create('bf65cb30-15b0-4e78-aebd-8a38f08940d7');
    const tickets = createTickets();    

    // Act
    const order = Order.create(bookingId, tickets);

    // Assert
    assertEquals(order.id instanceof OrderId, true);
    assertEquals(order.bookingId, bookingId);
    assertEquals(order.tickets.length, tickets.length);
    assertEquals(order.price.value, tickets.reduce((total, ticket) => total + ticket.price.value, 0));
    assertEquals(order.status.value, OrderStatusState.Open);
    assertEquals(order.agreeToTerms, false);
});

Deno.test('[Unit] - Order - create - invalid tickets - throws InvalidTicketAmountException', () => {
    // Arrange
    const bookingId = BookingId.create('bf65cb30-15b0-4e78-aebd-8a38f08940d7');
    const tickets: Ticket[] = [];   

    // Act & Assert
    assertThrows(
        () => Order.create(bookingId, tickets),
        InvalidTicketAmountException
    )
});

Deno.test('[Unit] - Order - acceptTerms - valid - set agreeToTerms to true', () => {
    // Arrange
    const bookingId = BookingId.create('bf65cb30-15b0-4e78-aebd-8a38f08940d7');
    const tickets = createTickets();
    const order = Order.create(bookingId, tickets);

    // Act
    order.acceptTerms(true);

    // Assert
    assertEquals(order.agreeToTerms, true);
});

Deno.test('[Unit] - Order - acceptTerms - invalid - throws InvalidOrderStatusException', () => {
    // Arrange
    const bookingId = BookingId.create('bf65cb30-15b0-4e78-aebd-8a38f08940d7');
    const tickets = createTickets();
    const order = Order.create(bookingId, tickets);
    order.acceptTerms(true);
    order.markAsPaid();

    // Act & Assert
    assertThrows(
        () => order.acceptTerms(true),
        InvalidOrderStatusException
    );
});

Deno.test('[Unit] - Order - addCustomer - valid - set customer', () => {
    // Arrange
    const bookingId = BookingId.create('bf65cb30-15b0-4e78-aebd-8a38f08940d7');
    const tickets = createTickets();
    const order = Order.create(bookingId, tickets);
    const customer = Customer.create(CustomerSalutation.create(CustomerSalutationType.Mr), CustomerFirstName.create('John'), CustomerLastName.create('Doe'), CustomerEmail.create('john.doe@email.com'));

    // Act
    order.addCustomer(true, customer);

    // Assert
    assertEquals(order.customer.isPresent, true);
});

Deno.test('[Unit] - Order - addCustomer - invalid agreement - should throw TermsNotAcceptedException', () => {
    // Arrange
    const bookingId = BookingId.create('bf65cb30-15b0-4e78-aebd-8a38f08940d7');
    const tickets = createTickets();
    const order = Order.create(bookingId, tickets);
    const customer = Customer.create(CustomerSalutation.create(CustomerSalutationType.Mr), CustomerFirstName.create('John'), CustomerLastName.create('Doe'), CustomerEmail.create('john.doe@email.com'));

    // Act & Assert
    assertThrows(
        () => order.addCustomer(false, customer),
        TermsNotAcceptedException
    );
});

Deno.test('[Unit] - Order - addCustomer - invalid status - should throw InvalidOrderStatusException', () => {
    // Arrange
    const bookingId = BookingId.create('bf65cb30-15b0-4e78-aebd-8a38f08940d7');
    const tickets = createTickets();
    const order = Order.create(bookingId, tickets);
    order.acceptTerms(true);
    order.markAsPaid();
    const customer = Customer.create(CustomerSalutation.create(CustomerSalutationType.Mr), CustomerFirstName.create('John'), CustomerLastName.create('Doe'), CustomerEmail.create('john.doe@email.com'));

    // Act & Assert
    assertThrows(
        () => order.addCustomer(true, customer),
        InvalidOrderStatusException
    );
});

Deno.test('[Unit] - Order - markAsPaid - valid - set status to Paid', () => {
    // Arrange
    const bookingId = BookingId.create('bf65cb30-15b0-4e78-aebd-8a38f08940d7');
    const tickets = createTickets();
    const order = Order.create(bookingId, tickets);
    order.acceptTerms(true);

    // Act
    order.markAsPaid();

    // Assert
    assertEquals(order.status.value, OrderStatusState.Paid);
});

Deno.test('[Unit] - Order - markAsPaid - invalid status - should throw InvalidOrderStatusException', () => {
    // Arrange
    const bookingId = BookingId.create('bf65cb30-15b0-4e78-aebd-8a38f08940d7');
    const tickets = createTickets();
    const order = Order.create(bookingId, tickets);
    order.acceptTerms(true);
    order.cancel();

    // Act & Assert
    assertThrows(
        () => order.markAsPaid(),
        InvalidOrderStatusException
    );
});

Deno.test('[Unit] - Order - markAsPaid - invalid agreement - should throw TermsNotAcceptedException', () => {
    // Arrange
    const bookingId = BookingId.create('bf65cb30-15b0-4e78-aebd-8a38f08940d7');
    const tickets = createTickets();
    const order = Order.create(bookingId, tickets);

    // Act & Assert
    assertThrows(
        () => order.markAsPaid(),
        TermsNotAcceptedException
    );
});

Deno.test('[Unit] - Order - releaseTickets - valid - set status to Released', () => {
    // Arrange
    const bookingId = BookingId.create('bf65cb30-15b0-4e78-aebd-8a38f08940d7');
    const tickets = createTickets();
    const order = Order.create(bookingId, tickets);
    order.acceptTerms(true);
    order.markAsPaid();

    // Act
    order.releaseTickets();

    // Assert
    assertEquals(order.status, OrderStatus.TicketReleased);
});

Deno.test('[Unit] - Order - releaseTickets - invalid status - should throw InvalidOrderStatusException', () => {
    // Arrange
    const bookingId = BookingId.create('bf65cb30-15b0-4e78-aebd-8a38f08940d7');
    const tickets = createTickets();
    const order = Order.create(bookingId, tickets);
    order.acceptTerms(true);

    // Act & Assert
    assertThrows(
        () => order.releaseTickets(),
        InvalidOrderStatusException
    );
});

Deno.test('[Unit] - Order - cancel - valid - set status to Cancelled', () => {
    // Arrange
    const bookingId = BookingId.create('bf65cb30-15b0-4e78-aebd-8a38f08940d7');
    const tickets = createTickets();
    const order = Order.create(bookingId, tickets);
    order.acceptTerms(true);
    // Act
    order.cancel();

    // Assert
    assertEquals(order.status, OrderStatus.Cancelled);
});

Deno.test('[Unit] - Order - cancel - invalid status - should throw InvalidOrderStatusException', () => {
    // Arrange
    const bookingId = BookingId.create('bf65cb30-15b0-4e78-aebd-8a38f08940d7');
    const tickets = createTickets();
    const order = Order.create(bookingId, tickets);
    order.acceptTerms(true);
    order.markAsPaid();

    // Act & Assert
    assertThrows(
        () => order.cancel(),
        InvalidOrderStatusException
    );
});