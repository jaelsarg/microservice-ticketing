import { RouterContext, WebApiController } from '@/Infrastructure/WebApi/Shared/mod.ts';
import { PayOrderInput } from '@/Application/Ticketing/Payments/mod.ts';
import { UseCase } from '@/Application/Ports/mod.ts';

export class PayOrderController implements WebApiController {
    private readonly _useCase: UseCase<PayOrderInput, string>;

    constructor(useCase: UseCase<PayOrderInput, string>) {
        console.log('PayOrderController instantiated');
        this._useCase = useCase;
    }

    async handle(ctx: RouterContext<string>): Promise<void> {
        console.log('PayOrderController handling request');
        console.log('------------------------');
        console.log('Request params:', ctx.params);
        const orderId = ctx.params.orderId;
        console.log('--------------------');
        console.log('Received request to pay order with ID:', orderId);

        if (!orderId) {
            ctx.response.status = 400;
            ctx.response.body = { error: 'Order ID is required' };
            return Promise.resolve();
        }

        const body = await ctx.request.body.json().catch(() => ({}));

        const input: PayOrderInput = {
            externalId: body.externalId,
            paymentMethod: body.paymentMethod,
            cardNumber: body.cardNumber,
            expiryDate: body.expiryDate,
            cvv: body.cvv,
            orderId: orderId,
            bookingId: body.bookingId,
            amount: body.amount,
        };

        const id = await this._useCase.execute(input);

        ctx.response.status = 201;
        ctx.response.body = { id };
    }
}
