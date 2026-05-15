import { UseCase } from '@/Application/Ports/mod.ts';
import { NotFoundApplicationException } from '@/Application/Shared/mod.ts';
import { GetOrderByBookingIdQuery, OrderData } from '@/Application/Ports/Queries/mod.ts';

export interface GetOrderByBookingIdInput {
    bookingId: string;
}

export interface GetOrderByBookingIdOutput {
    data: OrderData;
}

export class OrderByIdNotFoundApplicationException extends NotFoundApplicationException {
    constructor(bookingId: string) {
        super(`Order with ID "${bookingId}" was not found.`);
    }
}

export class GetOrderByBookingId implements UseCase<GetOrderByBookingIdInput, GetOrderByBookingIdOutput> {
    private readonly _query: GetOrderByBookingIdQuery;

    constructor(query: GetOrderByBookingIdQuery) {
        this._query = query;
    }

    async execute(input: GetOrderByBookingIdInput): Promise<GetOrderByBookingIdOutput> {
        const orderOptional = await this._query.fetch(input.bookingId);

        if (!orderOptional.isPresent) {
            throw new OrderByIdNotFoundApplicationException(input.bookingId);
        }

        return { data: orderOptional.value };
    }
}