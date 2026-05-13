import { ValueObject } from '@/Domain/Shared/mod.ts';
import { InvalidStatusTransitionError } from '@/Domain/Ticketing/Orders/OrderExceptions.ts';

export enum OrderStatusState {
    Open = 'Open',
    Paid = 'Paid',
    TicketReleased = 'TicketReleased',
    Cancelled = 'Cancelled',
}

export class OrderStatus extends ValueObject {
    private readonly _value: OrderStatusState;

    private constructor(value: OrderStatusState) {
        super();
        this._value = value;
    }

    static create(value: OrderStatusState): OrderStatus {
        const orderStatus = new OrderStatus(value);
        return orderStatus;
    }

    get value(): OrderStatusState {
        return this._value;
    }

    static readonly Open = new OrderStatus(OrderStatusState.Open);
    static readonly Paid = new OrderStatus(OrderStatusState.Paid);
    static readonly TicketReleased = new OrderStatus(OrderStatusState.TicketReleased);
    static readonly Cancelled = new OrderStatus(OrderStatusState.Cancelled);

    transitionTo(targetStatus: OrderStatus): OrderStatus {
        if (!this.canTransitionTo(targetStatus)) {
            throw new InvalidStatusTransitionError(this._value, targetStatus.value);
        }

        return targetStatus;
    }

    private canTransitionTo(targetStatus: OrderStatus): boolean {
        const validTransitions: Record<OrderStatusState, OrderStatusState[]> = {
            [OrderStatusState.Open]: [
                OrderStatusState.Paid,
                OrderStatusState.Cancelled,
            ],
            [OrderStatusState.Paid]: [
                OrderStatusState.TicketReleased,
            ],
            [OrderStatusState.TicketReleased]: [],
            [OrderStatusState.Cancelled]: [],
        };

        return validTransitions[this._value].includes(targetStatus._value);
    }

    override equals(other: OrderStatus): boolean {
        if (!other) {
            return false;
        }
        return this._value === other._value;
    }
}
