import { DomainException, NotFoundDomainException } from '@/Domain/Shared/mod.ts';

// Exceptions for BookingId (Value Object)
export class InvalidBookingIdException extends DomainException {
    constructor() {
        super('Booking ID cannot be empty.');
    }
}

// Exceptions for CustomerEmail (Value Object)
export class EmailEmptyException extends DomainException {
    constructor() {
        super('Customer email cannot be empty.');
    }
}

export class InvalidEmailFormatException extends DomainException {
    constructor(email: string) {
        super(`Invalid email format: "${email}".`);
    }
}

// Exceptions for CustomerFirstName (Value Object)
export class InvalidCustomerFirstNameException extends DomainException {
    constructor() {
        super('Customer first name cannot be empty.');
    }
}

// Exceptions for CustomerLastName (Value Object)
export class InvalidCustomerLastNameException extends DomainException {
    constructor() {
        super('Customer last name cannot be empty.');
    }
}

// Exceptions for OrderStatus (Value Object)
export class InvalidStatusTransitionError extends DomainException {
    constructor(currentStatus: string, targetStatus: string) {
        super(
            `Invalid status transition from "${currentStatus}" to "${targetStatus}".`,
        );
    }
}

// Exceptions for Seat (Value Object)
export class InvalidSeatNumberException extends DomainException {
    constructor(seatNumber: number) {
        super(`Invalid seat number: ${seatNumber}. Seat number must be greater than 0.`);
    }
}

// Exceptions for Order (Aggregate)
export class InvalidTicketAmountException extends DomainException {
    constructor() {
        super('Ticket amount must be at least 1.');
    }
}

export class InvalidOrderStatusException extends DomainException {
    constructor(status: string) {
        super(`Invalid order status: "${status}".`);
    }
}

export class TermsNotAcceptedException extends DomainException {
    constructor() {
        super('You must agree to the terms.');
    }
}

// Exceptions for not found
export class OrderNotFoundException extends NotFoundDomainException {
    constructor(orderId: string) {
        super(`Order with ID "${orderId}" not found.`);
    }
}

export class OrderWithBookingNotFound extends NotFoundDomainException {
    constructor(orderId: string, bookingId: string) {
        super(`There is no order with ID "${orderId}" that has a booking with ID "${bookingId}".`);
    }
}
