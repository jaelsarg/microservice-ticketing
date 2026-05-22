import { Logger, UnitOfWork, UseCase } from '@/Application/Ports/mod.ts';
import {
    Movie,
    MovieId,
    MovieNotFoundException,
    MovieRepository,
} from '@/Domain/Ticketing/Movies/mod.ts';
import {
    BookingId,
    MovieInfo,
    Order,
    Seat,
    Ticket,
    VisitorType,
} from '@/Domain/Ticketing/Orders/mod.ts';
import { VisitorTypeState } from '@/Domain/Ticketing/Orders/ValueObjects/VisitorType.ts';

export interface CreateOrderFromBookingInput {
    bookingId: string;
    movieId: string;
    room: string;
    showtime: Date;
    standardVisitors: number;
    discountVisitors: number;
    seatNumbers: number[];
}

export class CreateOrderFromBooking implements UseCase<CreateOrderFromBookingInput, string> {
    private readonly _uow: UnitOfWork;
    private readonly _logger: Logger;

    constructor(
        uow: UnitOfWork,
        logger: Logger,
    ) {
        this._uow = uow;
        this._logger = logger;
    }

    async execute(input: CreateOrderFromBookingInput): Promise<string> {
        this._logger.info('Creating order from booking', { input });

        const result = await this._uow.do<string>(async () => {
            // Check if movie exists
            const movieRepo = this._uow.getRepository<MovieRepository>('Movie');
            const movieId = MovieId.create(input.movieId);
            const movieOptional = await movieRepo.byId(movieId);

            if (!movieOptional.isPresent) {
                throw new MovieNotFoundException(movieId);
            }

            const movie = movieOptional.value;

            // Create order parameters
            const movieInfo = this.createMovieInfo(movie);
            const seats = this.createSeats(
                input.standardVisitors,
                input.discountVisitors,
                input.seatNumbers,
            );
            const tickets = this.createTickets(movieInfo, seats, input.room, input.showtime);
            const bookingId = BookingId.create(input.bookingId);

            // Create order
            const order = Order.create(bookingId, tickets);

            await this._uow.save(order);

            this._logger.info('Order created from booking', { orderId: order.id.value });

            return order.id.value;
        });

        return result;
    }

    private createMovieInfo(movie: Movie): MovieInfo {
        return MovieInfo.create(
            movie.id,
            movie.title,
            movie.duration,
            movie.genres,
            movie.posterUrl,
            movie.ageRating,
            movie.price,
        );
    }

    private createSeats(
        standardVisitors: number,
        discountVisitors: number,
        seatNumbers: number[],
    ): Seat[] {
        const seats: Seat[] = [];

        for (let i = 0; i < standardVisitors; i++) {
            const seatNumber = seatNumbers[i] ?? 0;
            seats.push(Seat.create(seatNumber, VisitorType.create(VisitorTypeState.Standard)));
        }

        for (let i = standardVisitors; i < standardVisitors + discountVisitors; i++) {
            const seatNumber = seatNumbers[i] ?? 0;
            seats.push(Seat.create(seatNumber, VisitorType.create(VisitorTypeState.Discount)));
        }

        return seats;
    }

    private createTickets(
        movieInfo: MovieInfo,
        seats: Seat[],
        room: string,
        showtime: Date,
    ): Ticket[] {
        const tickets: Ticket[] = [];

        for (const seat of seats) {
            const ticket = Ticket.create(movieInfo, seat, room, showtime);
            tickets.push(ticket);
        }

        return tickets;
    }
}
