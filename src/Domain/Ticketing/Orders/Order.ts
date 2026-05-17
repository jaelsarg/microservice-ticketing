import { AggregateRoot, UUIDEntityId } from '@/Domain/Shared/mod.ts';
import { Money } from '@/Domain/Ticketing/Movies/mod.ts';
import {
    BookingId,
    Customer,
    InvalidOrderStatusException,
    InvalidTicketAmountException,
    OrderPaid,
    OrderStatus,
    TermsNotAcceptedException,
    Ticket,
} from '@/Domain/Ticketing/Orders/mod.ts';
import { Optional } from '@domaincrafters/std';

export class OrderId extends UUIDEntityId {
    private constructor(id?: string) {
        super(id);
    }

    static create(id?: string): OrderId {
        return new OrderId(id);
    }
}

export class Order extends AggregateRoot<OrderId> {
    private readonly _bookingId: BookingId;
    private _customer: Optional<Customer> = Optional.empty<Customer>();
    private readonly _tickets: Ticket[];
    private readonly _price: Money;
    private _status: OrderStatus;
    private _agreeToTerms: boolean;

    private constructor(
        id: OrderId,
        bookingId: BookingId,
        tickets: Ticket[],
        price: Money,
        status: OrderStatus,
        agreeToTerms: boolean,
    ) {
        super(id);
        this._bookingId = bookingId;
        this._tickets = tickets;
        this._price = price;
        this._status = status;
        this._agreeToTerms = agreeToTerms;
    }

    static create(
        bookingId: BookingId,
        tickets: Ticket[],
    ): Order {
        if (!tickets || tickets.length === 0) {
            throw new InvalidTicketAmountException();
        }

        const price = Order.calculatePrice(tickets);

        const order = new Order(
            OrderId.create(),
            bookingId,
            tickets,
            price,
            OrderStatus.Open,
            false,
        );

        return order;
    }

    private static calculatePrice(tickets: Ticket[]): Money {
        const totalPrice = tickets.map((ticket) => ticket.price.value).reduce(
            (sum, value) => sum + value,
            0,
        );
        return Money.create(totalPrice);
    }

    get bookingId(): BookingId {
        return this._bookingId;
    }

    get customer(): Optional<Customer> {
        return this._customer;
    }

    get tickets(): Ticket[] {
        return this._tickets;
    }

    get price(): Money {
        return this._price;
    }

    get status(): OrderStatus {
        return this._status;
    }

    get agreeToTerms(): boolean {
        return this._agreeToTerms;
    }

    acceptTerms(value: boolean): void {
        if (!this._status.equals(OrderStatus.Open)) {
            throw new InvalidOrderStatusException(this._status.value);
        }

        this._agreeToTerms = value;
    }

    addCustomer(agreeToTerms: boolean, customer: Customer): void {
        this.acceptTerms(agreeToTerms);

        if (this._agreeToTerms === false) {
            throw new TermsNotAcceptedException();
        }

        this._customer = Optional.of<Customer>(customer);
    }

    markAsPaid(): void {
        if (!this._status.equals(OrderStatus.Open)) {
            throw new InvalidOrderStatusException(this._status.value);
        }

        if (this._agreeToTerms === false) {
            throw new TermsNotAcceptedException();
        }

        this._status = this._status.transitionTo(OrderStatus.Paid);

        this.raise(
            OrderPaid.create(
                this.id.value,
                this.bookingId.value,
            ),
        );
    }

    releaseTickets(): void {
        if (!this._status.equals(OrderStatus.Paid)) {
            throw new InvalidOrderStatusException(this._status.value);
        }

        this._status = this._status.transitionTo(OrderStatus.TicketReleased);
    }

    cancel(): void {
        if (!this._status.equals(OrderStatus.Open)) {
            throw new InvalidOrderStatusException(this._status.value);
        }

        this._status = this._status.transitionTo(OrderStatus.Cancelled);
    }
}
