import { RouterContext, WebApiController } from '@/Infrastructure/WebApi/Shared/mod.ts';
import { UseCase } from '@/Application/Ports/mod.ts';
import {
    GetOrderByBookingIdInput,
} from '@/Application/Ticketing/Orders/mod.ts';
import { OrderData } from '@/Application/Ports/Queries/mod.ts';

export class GetOrderByBookingIdController implements WebApiController {
    private readonly _useCase: UseCase<GetOrderByBookingIdInput, OrderData>;

    constructor(useCase: UseCase<GetOrderByBookingIdInput, OrderData>) {
        console.log('GetOrderByBookingIdController instantiated');
        this._useCase = useCase;
    }

    async handle(ctx: RouterContext<string>): Promise<void> {
        console.log('GetOrderByBookingIdController handling request');
        const bookingId = ctx.params.bookingId;

        if (!bookingId) {
            ctx.response.status = 400;
            ctx.response.body = { error: 'Booking ID is required' };
            return;
        }

        const order = await this._useCase.execute({ bookingId });

        if (!order) {
            ctx.response.status = 404;
            ctx.response.body = { error: 'Order not found' };
            return;
        }

        ctx.response.status = 200;
        ctx.response.body = order;
    }
}
