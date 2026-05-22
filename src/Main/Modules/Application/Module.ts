import { ServiceCollection, ServiceProvider } from '@domaincrafters/di';

import { domainEventPolicies } from '@/Application/mod.ts';
import type { Logger, UseCase } from '@/Application/Ports/mod.ts';
import type { GetOrderByBookingIdQuery } from '@/Application/Ports/Queries/mod.ts';
import { DomainEventRegistry } from '@/Infrastructure/Events/Shared/mod.ts';
import { PolicyDomainEventListener } from '@/Infrastructure/Events/mod.ts';
import {
    MongoDbGetOrderByBookingIdQuery,
} from '@/Infrastructure/Persistence/MongoDb/Queries/mod.ts';
import { MongoDbUnitOfWork } from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import { Config, ConsoleLogger } from '@/Infrastructure/Shared/mod.ts';
import { Module } from '@/Main/Modules/Shared/mod.ts';
import { OnlinePaymentService } from '@/Infrastructure/Payment/mod.ts';
import { SaveMovie, SaveMovieInput } from '@/Application/Ticketing/Movies/mod.ts';
import {
    AddCustomerToOrder,
    AddCustomerToOrderInput,
    CancelOrder,
    CreateOrderFromBooking,
    CreateOrderFromBookingInput,
    GetOrderByBookingId,
    MarkOrderAsPaid,
    ReleaseTickets,
    WhenOrderPaidThenReleaseTickets,
} from '@/Application/Ticketing/Orders/mod.ts';
import {
    PayOrder,
    WhenPaymentFailedThenCancelOrder,
    WhenPaymentSucceededThenMarkOrderAsPaid,
} from '@/Application/Ticketing/Payments/mod.ts';

export class Application implements Module {
    add(serviceCollection: ServiceCollection, _config: Config): void {
        console.log('Application module added');
        this.addUseCases(serviceCollection);
        this.addPolicies(serviceCollection);

        serviceCollection.addScoped(
            OnlinePaymentService.name,
            () => Promise.resolve(new OnlinePaymentService()),
        );
    }

    private addUseCases(serviceCollection: ServiceCollection): void {
        serviceCollection.addScoped(
            SaveMovie.name,
            async (serviceProvider: ServiceProvider) => {
                const uow =
                    (await serviceProvider.getService<MongoDbUnitOfWork>(MongoDbUnitOfWork.name))
                        .getOrThrow();

                const logger = (await serviceProvider.getService<Logger>(ConsoleLogger.name))
                    .getOrThrow();

                const useCase: UseCase<SaveMovieInput, void> = new SaveMovie(uow, logger);

                return useCase;
            },
        );

        serviceCollection.addScoped(
            CreateOrderFromBooking.name,
            async (serviceProvider: ServiceProvider) => {
                const uow =
                    (await serviceProvider.getService<MongoDbUnitOfWork>(MongoDbUnitOfWork.name))
                        .getOrThrow();

                const logger = (await serviceProvider.getService<Logger>(ConsoleLogger.name))
                    .getOrThrow();

                const useCase: UseCase<CreateOrderFromBookingInput, string> =
                    new CreateOrderFromBooking(uow, logger);

                return useCase;
            },
        );

        serviceCollection.addScoped(
            AddCustomerToOrder.name,
            async (serviceProvider: ServiceProvider) => {
                const uow =
                    (await serviceProvider.getService<MongoDbUnitOfWork>(MongoDbUnitOfWork.name))
                        .getOrThrow();

                const logger = (await serviceProvider.getService<Logger>(ConsoleLogger.name))
                    .getOrThrow();

                const useCase: UseCase<AddCustomerToOrderInput, string> = new AddCustomerToOrder(
                    uow,
                    logger,
                );

                return useCase;
            },
        );

        serviceCollection.addScoped(
            GetOrderByBookingId.name,
            async (serviceProvider: ServiceProvider) => {
                const query = (await serviceProvider.getService<GetOrderByBookingIdQuery>(
                    MongoDbGetOrderByBookingIdQuery.name,
                )).getOrThrow();

                return new GetOrderByBookingId(query);
            },
        );

        serviceCollection.addScoped(
            PayOrder.name,
            async (serviceProvider: ServiceProvider) => {
                const uow =
                    (await serviceProvider.getService<MongoDbUnitOfWork>(MongoDbUnitOfWork.name))
                        .getOrThrow();
                const logger = (await serviceProvider.getService<Logger>(ConsoleLogger.name))
                    .getOrThrow();
                const paymentService = (await serviceProvider.getService<OnlinePaymentService>(
                    OnlinePaymentService.name,
                )).getOrThrow();

                return new PayOrder(uow, logger, paymentService);
            },
        );

        serviceCollection.addScoped(
            MarkOrderAsPaid.name,
            async (serviceProvider: ServiceProvider) => {
                const uow =
                    (await serviceProvider.getService<MongoDbUnitOfWork>(MongoDbUnitOfWork.name))
                        .getOrThrow();
                const logger = (await serviceProvider.getService<Logger>(ConsoleLogger.name))
                    .getOrThrow();

                return new MarkOrderAsPaid(uow, logger);
            },
        );

        serviceCollection.addScoped(
            ReleaseTickets.name,
            async (serviceProvider: ServiceProvider) => {
                const uow =
                    (await serviceProvider.getService<MongoDbUnitOfWork>(MongoDbUnitOfWork.name))
                        .getOrThrow();
                const logger = (await serviceProvider.getService<Logger>(ConsoleLogger.name))
                    .getOrThrow();

                return new ReleaseTickets(uow, logger);
            },
        );

        serviceCollection.addScoped(
            CancelOrder.name,
            async (serviceProvider: ServiceProvider) => {
                const uow =
                    (await serviceProvider.getService<MongoDbUnitOfWork>(MongoDbUnitOfWork.name))
                        .getOrThrow();
                const logger = (await serviceProvider.getService<Logger>(ConsoleLogger.name))
                    .getOrThrow();

                return new CancelOrder(uow, logger);
            },
        );
    }

    private addPolicies(serviceCollection: ServiceCollection): void {
        serviceCollection.addScoped(
            WhenPaymentSucceededThenMarkOrderAsPaid.name,
            async (serviceProvider: ServiceProvider) => {
                const useCase =
                    (await serviceProvider.getService<MarkOrderAsPaid>(MarkOrderAsPaid.name))
                        .getOrThrow();

                const policy = new WhenPaymentSucceededThenMarkOrderAsPaid(useCase);

                return policy;
            },
        );

        serviceCollection.addScoped(
            WhenOrderPaidThenReleaseTickets.name,
            async (serviceProvider: ServiceProvider) => {
                const useCase =
                    (await serviceProvider.getService<ReleaseTickets>(ReleaseTickets.name))
                        .getOrThrow();

                const policy = new WhenOrderPaidThenReleaseTickets(useCase);

                return policy;
            },
        );

        serviceCollection.addScoped(
            WhenPaymentFailedThenCancelOrder.name,
            async (serviceProvider: ServiceProvider) => {
                const useCase = (await serviceProvider.getService<CancelOrder>(CancelOrder.name))
                    .getOrThrow();

                const policy = new WhenPaymentFailedThenCancelOrder(useCase);

                return policy;
            },
        );
    }

    async use(serviceProvider: ServiceProvider): Promise<void> {
        console.log('Application module use - Wiring policyregistry');

        // Get event bus from DI container
        const eventListener = (await serviceProvider.getService<PolicyDomainEventListener>(
            'PolicyDomainEventListener',
        ))
            .getOrThrow();

        // Create policy registry (Infrastructure)
        const policyregistry = new DomainEventRegistry([eventListener]);

        console.log(
            'Application module use - Registering policies from Application layer mapping',
            domainEventPolicies,
        );

        // Register policies from Application layer mapping
        // Policy instances are NOT resolved here - the EventBus will resolve them
        // with a fresh scope when handling each event
        policyregistry.registerFromMapping(domainEventPolicies);

        // Subscribe all policyregistry to event bus
        await policyregistry.subscribeAll();
    }

    static create(): Module {
        return new Application();
    }
}
