import { AmqpController } from '@/Infrastructure/Messaging/LavinMQ/Shared/mod.ts';
import { UseCase } from '@/Application/Ports/mod.ts';
import { CreateOrderFromBookingInput } from '@/Application/Ticketing/Orders/mod.ts';
import { Guard } from '@domaincrafters/std';

export interface CreateOrderFromBookingRequest {
    bookingId: string;
    movieId: string;
    room: string;
    showtime: string;
    standardVisitors: number;
    discountVisitors: number;
    seatNumbers: number[];
}

export class CreateOrderFromBookingController
    implements AmqpController<CreateOrderFromBookingRequest> {
    private readonly _useCase: UseCase<CreateOrderFromBookingInput, string>;

    constructor(useCase: UseCase<CreateOrderFromBookingInput, string>) {
        this._useCase = useCase;
    }

    async handle(request: CreateOrderFromBookingRequest): Promise<void> {
        console.log('Received CreateOrderFromBookingRequest:', request);
        this.validateRequest(request);

        const input: CreateOrderFromBookingInput = this.mapRequestToInput(request);

        await this._useCase.execute(input);
    }

    private validateRequest(request: CreateOrderFromBookingRequest): void {
        Guard.check(request.bookingId, 'bookingId').againstEmpty();
        Guard.check(request.movieId, 'movieId').againstEmpty();
        Guard.check(request.room, 'room').againstEmpty();
        Guard.check(request.showtime, 'showtime').againstEmpty();
        Guard.check(request.standardVisitors, 'standardVisitors').againstNegative();
        Guard.check(request.discountVisitors, 'discountVisitors').againstNegative();
        Guard.check(request.seatNumbers, 'seatNumbers').againstEmpty();
    }

    private mapRequestToInput(request: CreateOrderFromBookingRequest): CreateOrderFromBookingInput {
        return {
            bookingId: request.bookingId,
            movieId: request.movieId,
            room: request.room,
            showtime: new Date(request.showtime),
            standardVisitors: request.standardVisitors,
            discountVisitors: request.discountVisitors,
            seatNumbers: request.seatNumbers,
        };
    }
}
