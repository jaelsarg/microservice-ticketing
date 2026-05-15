import {
    CustomerData,
    GetOrderByBookingIdQuery,
    OrderData,
    TicketData,
} from '@/Application/Ports/Queries/mod.ts';
import { MongoDbClient } from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import { Optional } from '@domaincrafters/std';
import { Document } from '@mongodb';

interface TicketDocument {
    id: string;
    seatNumber: number;
    visitorType: string;
    price: number;
    movieId: string;
    room: string;
    showTime: string | Date;
}

export class MongoDbGetOrderByBookingIdQuery implements GetOrderByBookingIdQuery {
    private readonly _client: MongoDbClient;
    private readonly _collectionName: string = 'orders';

    constructor(client: MongoDbClient) {
        this._client = client;
    }

    async fetch(bookingId: string): Promise<Optional<OrderData>> {
        const document: Optional<Document> = await this._client.findDocument(
            { bookingId },
            this._collectionName,
        );

        if (!document.isPresent) {
            return Optional.empty<OrderData>();
        }

        const doc = document.value;

        const customerData: CustomerData | null = doc.customer
            ? {
                salutation: doc.customer.salutation,
                firstName: doc.customer.firstName,
                lastName: doc.customer.lastName,
                email: doc.customer.email,
            }
            : null;

        const ticketsData: TicketData[] = doc.tickets.map((ticket: TicketDocument) => ({
            id: ticket.id,
            seatNumber: ticket.seatNumber,
            visitorType: ticket.visitorType,
            price: ticket.price,
            movieId: ticket.movieId,
            room: ticket.room,
            showTime: new Date(ticket.showTime),
        }));

        const orderData: OrderData = {
            id: doc.id,
            bookingId: doc.bookingId,
            status: doc.status,
            price: doc.price,
            agreeToTerms: doc.agreeToTerms,
            customer: customerData,
            tickets: ticketsData,
        };

        return Optional.of<OrderData>(orderData);
    }
}
