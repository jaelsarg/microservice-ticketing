import {
    DocumentMapper,
    serializeObjectToDocument,
} from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import {
    Customer,
    MovieInfo,
    Order,
    OrderId,
    OrderStatus,
    OrderStatusState,
    Seat,
    Ticket,
    TicketId,
    VisitorType,
    VisitorTypeState,
} from '@/Domain/Ticketing/Orders/mod.ts';
import { Document } from '@mongodb';
import {
    AgeRating,
    Genre,
    Money,
    MovieDuration,
    MovieId,
    MovieTitle,
    PosterUrl,
} from '@/Domain/Ticketing/Movies/mod.ts';

type TicketDocument = {
    id: string;
    movieInfo: MovieInfoDocument;
    seat: SeatDocument;
    room: string;
    price: number;
    showTime: Date;
};

type MovieInfoDocument = {
    id: string;
    title: string;
    duration: number;
    genres: string[];
    posterUrl: string;
    ageRating: number;
    price: number;
};

type SeatDocument = {
    seatNumber: number;
    visitorType: VisitorTypeState;
};

type CustomerDocument = {
    salutation: string;
    firstName: string;
    lastName: string;
    email: string;
};

export class OrderDocumentMapper implements DocumentMapper<Order> {
    // Convert an Order aggregate to a MongoDB document
    toDocument(order: Order): Document {
        const tickets: TicketDocument[] = order.tickets.map((ticket) => {
            const movieInfo: MovieInfoDocument = {
                id: ticket.movieInfo.movieId.toString(),
                title: ticket.movieInfo.title.value,
                duration: ticket.movieInfo.duration.value,
                genres: ticket.movieInfo.genres.map((genre) => genre.value),
                posterUrl: ticket.movieInfo.posterUrl.value,
                ageRating: ticket.movieInfo.ageRating.value,
                price: ticket.movieInfo.price.value,
            };

            const seat: SeatDocument = {
                seatNumber: ticket.seat.seatNumber,
                visitorType: ticket.seat.visitorType.value,
            };

            return {
                id: ticket.id.toString(),
                movieInfo: movieInfo,
                seat: seat,
                room: ticket.room,
                price: ticket.price.value,
                showTime: ticket.showTime,
            };
        });

        const customer = order.customer.isPresent
            ? {
                salutation: order.customer.value.salutation.value,
                firstName: order.customer.value.firstName.value,
                lastName: order.customer.value.lastName.value,
                email: order.customer.value.email.value,
            }
            : null;

        const document = serializeObjectToDocument({
            id: order.id.toString(),
            bookingId: order.bookingId.value,
            tickets: tickets,
            price: order.price.value,
            status: order.status.value,
            agreeToTerms: order.agreeToTerms,
            customer: customer,
        });

        return document;
    }

    // Reconstitute an Order aggregate from a MongoDB document
    reconstitute(document: Document): Order {
        const ticketsData = Array.isArray(document.tickets) ? document.tickets : [];
        const tickets = ticketsData.map((ticketDoc) => this.reconstituteTicket(ticketDoc));

        const customerData = document.customer;
        const customer = customerData ? this.reconstituteCustomer(customerData) : null;

        const order = this.reconstituteFromDocument(
            (document.id ?? document._id) as string,
            document.bookingId as string,
            tickets,
            document.price,
            document.status,
            document.agreeToTerms,
            customer,
        );

        return order;
    }

    private reconstituteFromDocument(
        id: string,
        bookingId: string,
        tickets: Ticket[],
        price: number,
        status: string,
        agreeToTerms: boolean,
        customer: Customer | null,
    ): Order {
        const order = Object.create(Order.prototype);

        order['_id'] = OrderId.create(id);
        order['_bookingId'] = OrderId.create(bookingId);
        order['_tickets'] = tickets;
        order['_price'] = Money.create(price);
        order['_status'] = OrderStatus.create(status as OrderStatusState);
        order['_agreeToTerms'] = agreeToTerms;
        order['_customer'] = customer;

        order['_domainEvents'] = [];

        return order;
    }

    private reconstituteTicket(ticketDoc: TicketDocument) {
        const ticket = Object.create(Ticket.prototype);

        ticket['_id'] = TicketId.create(ticketDoc.id);
        ticket['_movieInfo'] = this.reconstituteMovieInfo(ticketDoc.movieInfo);
        ticket['_seat'] = this.reconstituteSeat(ticketDoc.seat);
        ticket['_room'] = ticketDoc.room;
        ticket['_price'] = Money.create(ticketDoc.price);
        ticket['_showTime'] = new Date(ticketDoc.showTime);

        return ticket;
    }

    private reconstituteMovieInfo(movieInfoDoc: MovieInfoDocument) {
        const movieInfo = Object.create(MovieInfo.prototype);

        movieInfo['_movieId'] = MovieId.create(movieInfoDoc.id);
        movieInfo['_title'] = MovieTitle.create(movieInfoDoc.title);
        movieInfo['_duration'] = MovieDuration.create(movieInfoDoc.duration);
        movieInfo['_genres'] = movieInfoDoc.genres.map((genre) => Genre.create(genre));
        movieInfo['_posterUrl'] = PosterUrl.create(movieInfoDoc.posterUrl);
        movieInfo['_ageRating'] = AgeRating.create(movieInfoDoc.ageRating);
        movieInfo['_price'] = Money.create(movieInfoDoc.price);

        return movieInfo;
    }

    private reconstituteSeat(seatDoc: SeatDocument) {
        const seat = Object.create(Seat.prototype);

        seat['_seatNumber'] = seatDoc.seatNumber;
        seat['_visitorType'] = VisitorType.create(seatDoc.visitorType as VisitorTypeState);

        return seat;
    }

    private reconstituteCustomer(customerDoc: CustomerDocument) {
        const customer = Object.create(Customer.prototype);

        customer['_salutation'] = customerDoc.salutation;
        customer['_firstName'] = customerDoc.firstName;
        customer['_lastName'] = customerDoc.lastName;
        customer['_email'] = customerDoc.email;

        return customer;
    }
}
