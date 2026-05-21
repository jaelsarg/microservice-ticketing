// Aggregate Root
export { Order, OrderId } from './Order.ts';

// Entity
export { Ticket, TicketId } from './Ticket.ts';

// Value Objects
export { BookingId } from './ValueObjects/BookingId.ts';
export { Customer } from './ValueObjects/Customer.ts';
export { CustomerSalutation, CustomerSalutationType } from './ValueObjects/CustomerSalutation.ts';
export { CustomerFirstName } from './ValueObjects/CustomerFirstName.ts';
export { CustomerLastName } from './ValueObjects/CustomerLastName.ts';
export { CustomerEmail } from './ValueObjects/CustomerEmail.ts';
export { Seat } from './ValueObjects/Seat.ts';
export { VisitorType, VisitorTypeState } from './ValueObjects/VisitorType.ts';
export { OrderStatus, OrderStatusState } from './ValueObjects/OrderStatus.ts';
export { MovieInfo } from './ValueObjects/MovieInfo.ts';

// Exceptions
export {
    EmailEmptyException,
    InvalidBookingIdException,
    InvalidCustomerFirstNameException,
    InvalidCustomerLastNameException,
    InvalidEmailFormatException,
    InvalidOrderStatusException,
    InvalidSeatNumberException,
    InvalidStatusTransitionError,
    InvalidTicketAmountException,
    OrderNotFoundException,
    OrderWithBookingNotFound,
    TermsNotAcceptedException,
} from './OrderExceptions.ts';

// Repository Interface
export { type OrderRepository } from './OrderRepository.ts';

// Events
export { OrderDomainEvent } from './Events/OrderDomainEvent.ts';
export { OrderPaid } from './Events/OrderPaid.ts';
export { TicketsReleased } from './Events/TicketsReleased.ts';
export { CustomerInfoAdded } from './Events/CustomerInfoAdded.ts';
