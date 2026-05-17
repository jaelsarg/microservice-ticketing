import { Logger, UnitOfWork, UseCase } from '@/Application/Ports/mod.ts';
import { OrderId, OrderNotFoundException, OrderRepository } from '@/Domain/Ticketing/Orders/mod.ts';

export interface MarkOrderAsPaidInput {
    orderId: string;
}

export class MarkOrderAsPaid implements UseCase<MarkOrderAsPaidInput, void> {
    private readonly _uow: UnitOfWork;
    private readonly _logger: Logger;

    constructor(uow: UnitOfWork, logger: Logger) {
        this._uow = uow;
        this._logger = logger;
    }

    async execute(input: MarkOrderAsPaidInput): Promise<void> {
        this._logger.info('MarkOrderAsPaid - start execution', {
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

            order.markAsPaid();

            this._logger.info('Order marked as paid', {
                orderId: order.id.value,
            });

            await orderRepo.save(order);
        });
    }
}
