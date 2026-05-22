import { Optional } from '@domaincrafters/std';

export interface OrderData {
    id: string;
    bookingId: string;
    status: string;
    price: number;
    agreeToTerms: boolean;
    customer: CustomerData | null;
    tickets: TicketData[];
}

export interface CustomerData {
    salutation: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface TicketData {
    id: string;
    seatNumber: number;
    visitorType: string;
    price: number;
    movieId: string;
    room: string;
    showtime: Date;
}

export interface GetOrderByBookingIdQuery {
    fetch(id: string): Promise<Optional<OrderData>>;
}
