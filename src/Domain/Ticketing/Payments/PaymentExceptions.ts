// export class InvalidTicketAmountException extends DomainException {
//     constructor() {
//         super('Ticket amount must be at least 1.');
//     }
// }

// Exceptions for ExternalId (Value Object)
import { DomainException } from '@/Domain/Shared/mod.ts';

export class InvalidExternalIdException extends DomainException {
    constructor() {
        super('External ID must not be empty or contain only whitespace.');
    }
}

// Exceptions for CardNumber (Value Object)
export class InvalidCardNumberException extends DomainException {
    constructor() {
        super('Card number must be between 12 and 19 characters long and not empty.');
    }
}

// Exceptions for ExpiryDate (Value Object)
export class EmptyExpiryDateException extends DomainException {
    constructor() {
        super('Expiry date must not be empty or contain only whitespace.');
    }
}

export class InvalidExpiryDateFormatException extends DomainException {
    constructor() {
        super('Expiry date must be in the format MM/YY or MM/YYYY.');
    }
}

export class InvalidExpiryDateException extends DomainException {
    constructor(value: string) {
        super(`Expiry date "${value}" is invalid. Month must be between 01 and 12.`);
    }
}

// Exceptions for CVV (Value Object)
export class EmptyCVVException extends DomainException {
    constructor() {
        super('CVV must not be empty or contain only whitespace.');
    }
}

export class InvalidCVVException extends DomainException {
    constructor(value: string) {
        super(`CVV "${value}" is invalid. Must be 3 or 4 characters long.`);
    }
}

// Exceptions for PaymentAmount (Value Object)
export class InvalidPaymentAmountException extends DomainException {
    constructor(value: number) {
        super(`Payment amount "${value}" is invalid. Must be a positive number.`);
    }
}

// Exceptions for PaymentStatus (Value Object)
export class InvalidPaymentStatusTransitionException extends DomainException {
    constructor(currentStatus: string, targetStatus: string) {
        super(`Cannot transition payment status from "${currentStatus}" to "${targetStatus}".`);
    }
}

// Exceptions for Payment (Aggregate)
export class InvalidFailedReasonException extends DomainException {
    constructor() {
        super('Failed reason must not be empty or contain only whitespace.');
    }
}
