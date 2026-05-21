import { ServiceProvider } from '@domaincrafters/di';

import type { UseCase } from '@/Application/Ports/mod.ts';
import {
    CreateOrderFromBookingController,
    CreateOrderFromBookingRequest,
    SaveMovieController,
} from '@/Infrastructure/Messaging/LavinMQ/Controllers/mod.ts';

import {
    type AmqpController,
    type ControllerFactory,
} from '@/Infrastructure/Messaging/LavinMQ/Shared/mod.ts';
import type { ConsumerContext } from '@/Infrastructure/Messaging/LavinMQ/Shared/Amqp/AmqpBrokerConfigurator.ts';
import { IllegalStateException } from '@domaincrafters/std';
import { SaveMovie, SaveMovieInput } from '@/Application/Ticketing/Movies/mod.ts';
import {
    CreateOrderFromBooking,
    CreateOrderFromBookingInput,
} from '@/Application/Ticketing/Orders/mod.ts';

export class AmqpControllerFactory implements ControllerFactory {
    private readonly _serviceProvider: ServiceProvider;

    constructor(serviceProvider: ServiceProvider) {
        this._serviceProvider = serviceProvider;
        console.log('AmqpControllerFactory initialized', this._serviceProvider.toString());
    }

    create(consumerContext: ConsumerContext): Promise<AmqpController<unknown>> {
        const operationId: string = consumerContext.operationId;
        const eventName: string = consumerContext.eventName;
        const normalizedOperationId = operationId.toLowerCase();

        switch (normalizedOperationId) {
            case 'whenmovieregisteredsavemovie':
                return this.createSaveMovieController();
            case 'whenbookingopenedcreateorder':
                return this.createCreateOrderFromBookingController();
            default:
                throw new IllegalStateException(
                    `No controller is defined for operation '${operationId}' and event '${eventName}'`,
                );
        }
    }

    private async createSaveMovieController(): Promise<AmqpController<unknown>> {
        const useCase = (await this._serviceProvider.getService<
            UseCase<SaveMovieInput, void>
        >(SaveMovie.name)).getOrThrow();

        return new SaveMovieController(useCase) as AmqpController<unknown>;
    }

    private async createCreateOrderFromBookingController(): Promise<AmqpController<unknown>> {
        const useCase = (await this._serviceProvider.getService<
            UseCase<CreateOrderFromBookingInput, string>
        >(CreateOrderFromBooking.name)).getOrThrow();

        return new CreateOrderFromBookingController(useCase) as AmqpController<
            CreateOrderFromBookingRequest
        >;
    }
}
