import { OrderDomainEvent } from '@/Domain/Ticketing/Orders/mod.ts';
import { EventFQDN } from '../../../Shared/mod.ts';

export interface CustomerDetail {
    salutation: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface TicketDetail {
    ticketId: string;
    movieId: string;
    room: string;
    seatNumber: number;
    visitorType: string;
    price: number;
    showtime: Date;
}

export class TicketsReleased extends OrderDomainEvent {
    static readonly FQDN = EventFQDN.create(
        `${OrderDomainEvent.FQDN_PREFIX}.ticketsreleased`,
    );

    private readonly _orderId: string;
    private readonly _customer: CustomerDetail | null;
    private readonly _tickets: TicketDetail[];
    private readonly _occurredOn: Date;

    private constructor(
        orderId: string,
        tickets: TicketDetail[],
        customer: CustomerDetail | null,
    ) {
        super();
        this._orderId = orderId;
        this._customer = customer;
        this._tickets = tickets;
        this._occurredOn = new Date();
    }

    static create(
        orderId: string,
        tickets: TicketDetail[],
        customer?: CustomerDetail | null,
    ): TicketsReleased {
        return new TicketsReleased(orderId, tickets, customer ?? null);
    }

    override get FQDN(): EventFQDN {
        return TicketsReleased.FQDN;
    }
    override get occurredOn(): Date {
        return this._occurredOn;
    }

    get orderId(): string {
        return this._orderId;
    }

    get customer(): CustomerDetail | null {
        return this._customer;
    }

    get tickets(): TicketDetail[] {
        return this._tickets;
    }
}
