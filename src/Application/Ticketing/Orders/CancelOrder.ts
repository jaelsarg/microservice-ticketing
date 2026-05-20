import { Logger, UnitOfWork, UseCase } from '@/Application/Ports/mod.ts';
import { OrderId, OrderNotFoundException, OrderRepository } from '@/Domain/Ticketing/Orders/mod.ts';

export interface CancelOrderInput {
    orderId: string;
}

export class CancelOrder implements UseCase<CancelOrderInput, void> {
    private readonly _uow: UnitOfWork;
    private readonly _logger: Logger;

    constructor(uow: UnitOfWork, logger: Logger) {
        this._uow = uow;
        this._logger = logger;
    }

    async execute(input: CancelOrderInput): Promise<void> {
        this._logger.info('CancelOrder - start execution', {
            orderId: input.orderId,
        });

        await this._uow.do<void>(async () => {
            const orderRepo = this._uow.getRepository<OrderRepository>('Order');
            const orderId = OrderId.create(input.orderId);
            const orderOptional = await orderRepo.byId(orderId);

            if (!orderOptional.isPresent) {
                throw new OrderNotFoundException(orderId.value);
            }

            const order = orderOptional.value;

            order.cancel();

            this._logger.info('Order cancelled', {
                orderId: order.id.value,
            });

            await this._uow.save(order);
        });
    }
}
