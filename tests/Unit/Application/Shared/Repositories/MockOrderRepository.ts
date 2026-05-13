import { Optional } from '@domaincrafters/std';
import { Order, OrderId, OrderRepository } from '@/Domain/Ticketing/Orders/mod.ts';

interface MockOrderRepositoryOptions {
    byName?: (name: string) => Promise<Optional<Order>>;
    existsByName?: (name: string) => Promise<boolean>;
    save?: (order: Order) => Promise<void>;
    byId?: (id: OrderId) => Promise<Optional<Order>>;
    remove?: (order: Order) => Promise<void>;
}

export class MockOrderRepository implements OrderRepository {
    saveCalled = false;
    savedOrder: Order | null = null;
    removeCalled = false;
    removedOrder: Order | null = null;

    constructor(private readonly options: MockOrderRepositoryOptions = {}) {}

    async byName(name: string): Promise<Optional<Order>> {
        if (this.options.byName) {
            return this.options.byName(name);
        }
        return Optional.empty<Order>();
    }

    async existsByName(name: string): Promise<boolean> {
        if (this.options.existsByName) {
            return this.options.existsByName(name);
        }
        const existing = await this.byName(name);
        return existing.isPresent;
    }

    async save(order: Order): Promise<void> {
        if (this.options.save) {
            return this.options.save(order);
        }
        this.saveCalled = true;
        this.savedOrder = order;
    }

    async byId(id: OrderId): Promise<Optional<Order>> {
        if (this.options.byId) {
            return this.options.byId(id);
        }
        return Optional.empty<Order>();
    }

    async remove(order: Order): Promise<void> {
        if (this.options.remove) {
            return this.options.remove(order);
        }
        this.removeCalled = true;
        this.removedOrder = order;
    }
}

export function createMockOrderRepository(
    options: MockOrderRepositoryOptions = {},
): MockOrderRepository {
    return new MockOrderRepository(options);
}