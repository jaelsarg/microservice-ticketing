import { Optional } from '@domaincrafters/std';
import { Payment, PaymentId, PaymentRepository } from '@/Domain/Ticketing/Payments/mod.ts';

interface MockPaymentRepositoryOptions {
    byName?: (name: string) => Promise<Optional<Payment>>;
    existsByName?: (name: string) => Promise<boolean>;
    save?: (payment: Payment) => Promise<void>;
    byId?: (id: PaymentId) => Promise<Optional<Payment>>;
    remove?: (payment: Payment) => Promise<void>;
}

export class MockPaymentRepository implements PaymentRepository {
    saveCalled = false;
    savedOrder: Payment | null = null;
    removeCalled = false;
    removedOrder: Payment | null = null;

    constructor(private readonly options: MockPaymentRepositoryOptions = {}) {}

    async byId(id: PaymentId): Promise<Optional<Payment>> {
        if (this.options.byId) {
            return this.options.byId(id);
        }
        return Optional.empty<Payment>();
    }

    async save(payment: Payment): Promise<void> {
        if (this.options.save) {
            return this.options.save(payment);
        }
        this.saveCalled = true;
        this.savedOrder = payment;
    }

    async remove(payment: Payment): Promise<void> {
        if (this.options.remove) {
            return this.options.remove(payment);
        }
        this.removeCalled = true;
        this.removedOrder = payment;
    }
}

export function createMockPaymentRepository(
    options: MockPaymentRepositoryOptions = {},
): MockPaymentRepository {
    return new MockPaymentRepository(options);
}