import { DomainException } from '@/Domain/Shared/mod.ts';

// Exception thrown when trying to create an Order
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

// Exception thrown when trying to do an invalid OrderStatus transition
export class InvalidStatusTransitionError extends DomainException {
    constructor(currentStatus: string, targetStatus: string) {
        super(
            `Invalid status transition from "${currentStatus}" to "${targetStatus}".`,
        );
    }
}

// Exception thrown when trying to create a Seat
export class InvalidSeatNumberException extends DomainException {
    constructor(seatNumber: number) {
        super(`Invalid seat number: ${seatNumber}. Seat number must be greater than 0.`);
    }
}

// Exception thrown when trying to create a CustomerFirstName
export class InvalidCustomerFirstNameException extends DomainException {
    constructor() {
        super('Customer first name cannot be empty.');
    }
}

// Exception thrown when trying to create a CustomerLastName
export class InvalidCustomerLastNameException extends DomainException {
    constructor() {
        super('Customer last name cannot be empty.');
    }
}

// Exception thrown when trying to create a CustomerEmail
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

export class InvalidBookingIdException extends DomainException {
    constructor() {
        super('Booking ID cannot be empty.');
    }
}

export class OrderNotFoundException extends DomainException {
    constructor(orderId: string) {
        super(`Order with ID "${orderId}" not found.`);
    }
}
