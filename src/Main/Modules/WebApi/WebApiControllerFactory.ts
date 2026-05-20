import { ServiceProvider } from '@domaincrafters/di';

import {
    CreateSuggestionUseCase,
    type CreateSuggestionUseCaseInput,
    GetSuggestionByIdQueryUseCase,
    type GetSuggestionByIdQueryUseCaseInput,
    ListSuggestionsQueryUseCase,
} from '@/Application/Ticketing/Suggestions/mod.ts';
import type { UseCase } from '@/Application/Ports/mod.ts';
import type {
    OrderData,
    SuggestionByIdReadModel,
    SuggestionListItemReadModel,
} from '@/Application/Ports/Queries/mod.ts';
import {
    AddCustomerToOrderController,
    CreateSuggestionController,
    GetOrderByBookingIdController,
    GetSuggestionByIdController,
    ListSuggestionsController,
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
import { PayOrderController } from '@/Infrastructure/WebApi/Controllers/PayOrderController.ts';
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

            // Suggestions
            case CreateSuggestionController.name:
                return await this.createCreateSuggestionController();
            case ListSuggestionsController.name:
                return await this.createListSuggestionsController();
            case GetSuggestionByIdController.name:
                return await this.createGetSuggestionByIdController();

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

    // Suggestions
    private async createCreateSuggestionController(): Promise<CreateSuggestionController> {
        const useCase = (await this._serviceProvider.getService<
            UseCase<CreateSuggestionUseCaseInput, string>
        >(CreateSuggestionUseCase.name)).getOrThrow();

        return new CreateSuggestionController(useCase);
    }

    private async createListSuggestionsController(): Promise<ListSuggestionsController> {
        const useCase = (await this._serviceProvider.getService<
            UseCase<void, SuggestionListItemReadModel[]>
        >(ListSuggestionsQueryUseCase.name)).getOrThrow();

        return new ListSuggestionsController(useCase);
    }

    private async createGetSuggestionByIdController(): Promise<GetSuggestionByIdController> {
        const useCase = (await this._serviceProvider.getService<
            UseCase<GetSuggestionByIdQueryUseCaseInput, SuggestionByIdReadModel>
        >(GetSuggestionByIdQueryUseCase.name)).getOrThrow();

        return new GetSuggestionByIdController(useCase);
    }
}
