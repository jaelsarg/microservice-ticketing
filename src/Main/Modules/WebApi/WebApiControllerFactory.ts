import { ServiceProvider } from '@domaincrafters/di';

import type { UseCase } from '@/Application/Ports/mod.ts';
import type {
    OrderData,
} from '@/Application/Ports/Queries/mod.ts';
import {
    AddCustomerToOrderController,
    GetOrderByBookingIdController,
    PayOrderController,
} from '@/Infrastructure/WebApi/Controllers/mod.ts';
import {
    type ControllerFactory,
    type RouterContext,
    type WebApiController,
} from '@/Infrastructure/WebApi/Shared/mod.ts';
import { IllegalStateException } from '@domaincrafters/std';
import {
    AddCustomerToOrder,
    AddCustomerToOrderInput,
    GetOrderByBookingId,
    GetOrderByBookingIdInput,
} from '@/Application/Ticketing/Orders/mod.ts';
import { PayOrder, PayOrderInput } from '@/Application/Ticketing/Payments/mod.ts';

export class WebApiControllerFactory implements ControllerFactory {
    private readonly _serviceProvider: ServiceProvider;

    constructor(serviceProvider: ServiceProvider) {
        this._serviceProvider = serviceProvider;
    }

    async create(ctx: RouterContext<string>): Promise<WebApiController> {
        if (!ctx.routeName) {
            throw new IllegalStateException('Route name is not defined');
        }

        switch (ctx.routeName) {
            case AddCustomerToOrderController.name:
                return await this.createAddCustomerToOrderController();
            case GetOrderByBookingIdController.name:
                return await this.createGetOrderByBookingIdController();
            case PayOrderController.name:
                return await this.createPayOrderController();
            default:
                throw new IllegalStateException(
                    `Controller for route ${ctx.routeName} is not defined`,
                );
        }
    }

    private async createAddCustomerToOrderController(): Promise<AddCustomerToOrderController> {
        const useCase = (await this._serviceProvider.getService<
            UseCase<AddCustomerToOrderInput, string>
        >(AddCustomerToOrder.name)).getOrThrow();

        return new AddCustomerToOrderController(useCase);
    }

    private async createGetOrderByBookingIdController(): Promise<GetOrderByBookingIdController> {
        const useCase = (await this._serviceProvider.getService<
            UseCase<GetOrderByBookingIdInput, OrderData>
        >(GetOrderByBookingId.name)).getOrThrow();

        return new GetOrderByBookingIdController(useCase);
    }

    private async createPayOrderController(): Promise<PayOrderController> {
        const useCase = (await this._serviceProvider.getService<
            UseCase<PayOrderInput, string>
        >(PayOrder.name)).getOrThrow();

        return new PayOrderController(useCase);
    }
}
