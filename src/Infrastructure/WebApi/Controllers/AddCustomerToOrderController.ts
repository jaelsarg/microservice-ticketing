import { RouterContext, WebApiController } from '@/Infrastructure/WebApi/Shared/mod.ts';
import { UseCase } from '@/Application/Ports/mod.ts';
import { AddCustomerToOrderInput } from '@/Application/Ticketing/Orders/mod.ts';

export class AddCustomerToOrderController implements WebApiController {
    private readonly _useCase: UseCase<AddCustomerToOrderInput, string>;

    constructor(useCase: UseCase<AddCustomerToOrderInput, string>) {
        console.log('AddCustomerToOrderController instantiated');
        this._useCase = useCase;
    }

    async handle(ctx: RouterContext<string>): Promise<void> {
        console.log('AddCustomerToOrderController handling request');
        console.log('Request params:', ctx.params);
        const orderId = ctx.params.orderId;

        if (!orderId) {
            ctx.response.status = 400;
            ctx.response.body = { error: 'Order ID is required' };
            return;
        }

        const body = await ctx.request.body.json().catch(() => ({}));

        const input: AddCustomerToOrderInput = {
            orderId: orderId,
            salutation: body.salutation,
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            agreeToTerms: body.agreeToTerms,
        };

        const id = await this._useCase.execute(input);

        ctx.response.status = 201;
        ctx.response.body = { id };
    }
}
