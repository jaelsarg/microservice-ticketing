import { Entity, UUIDEntityId } from '@/Domain/Shared/mod.ts';
import { Money } from '@/Domain/Ticketing/Movies/mod.ts';
import { MovieInfo, Seat, VisitorType, VisitorTypeState } from '@/Domain/Ticketing/Orders/mod.ts';

export class TicketId extends UUIDEntityId {
    private constructor(id?: string) {
        super(id);
    }

    static create(id?: string): TicketId {
        return new TicketId(id);
    }
}

export class Ticket extends Entity<TicketId> {
    private static readonly DISCOUNT_RATE = 0.9;

    private readonly _movieInfo: MovieInfo;
    private readonly _seat: Seat;
    private readonly _room: string;
    private readonly _price: Money;
    private readonly _showtime: Date;

    private constructor(
        id: TicketId,
        movieInfo: MovieInfo,
        seat: Seat,
        room: string,
        price: Money,
        showtime: Date,
    ) {
        super(id);
        this._movieInfo = movieInfo;
        this._seat = seat;
        this._room = room;
        this._price = price;
        this._showtime = showtime;
    }

    static create(
        movieInfo: MovieInfo,
        seat: Seat,
        room: string,
        showtime: Date,
    ): Ticket {
        const price = this.calculatePrice(movieInfo.price, seat.visitorType);

        const ticket = new Ticket(
            TicketId.create(),
            movieInfo,
            seat,
            room,
            price,
            showtime,
        );

        return ticket;
    }

    private static calculatePrice(price: Money, visitorType: VisitorType): Money {
        if (visitorType.equals(VisitorType.create(VisitorTypeState.Discount))) {
            return Money.create(price.value * this.DISCOUNT_RATE);
        }
        return price;
    }

    get movieInfo(): MovieInfo {
        return this._movieInfo;
    }

    get seat(): Seat {
        return this._seat;
    }

    get room(): string {
        return this._room;
    }

    get price(): Money {
        return this._price;
    }

    get showtime(): Date {
        return this._showtime;
    }
}
