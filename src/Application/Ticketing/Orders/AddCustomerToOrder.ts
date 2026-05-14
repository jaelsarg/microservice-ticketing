import { Logger, UnitOfWork, UseCase } from '@/Application/Ports/mod.ts';
import {
    Customer,
    CustomerEmail,
    CustomerFirstName,
    CustomerLastName,
    CustomerSalutation,
    CustomerSalutationType,
    OrderId,
    OrderNotFoundException,
    OrderRepository,
} from '@/Domain/Ticketing/Orders/mod.ts';

export interface AddCustomerToOrderInput {
    orderId: string;
    salutation: string;
    firstName: string;
    lastName: string;
    email: string;
    agreeToTerms: boolean;
}

export class AddCustomerToOrder implements UseCase<AddCustomerToOrderInput, string> {
    private readonly _uow: UnitOfWork;
    private readonly _logger: Logger;

    constructor(
        uow: UnitOfWork,
        logger: Logger,
    ) {
        this._uow = uow;
        this._logger = logger;
    }

    async execute(input: AddCustomerToOrderInput): Promise<string> {
        this._logger.info('Adding customer to order', { input });

        const result = await this._uow.do<string>(async () => {
            // Check if order exists
            const orderRepo = this._uow.getRepository<OrderRepository>('Order');
            const orderId = OrderId.create(input.orderId);
            const orderOptional = await orderRepo.byId(orderId);

            if (!orderOptional.isPresent) {
                throw new OrderNotFoundException(orderId.value);
            }

            const order = orderOptional.value;

            // Create customer parameters
            const salutation = CustomerSalutation.create(
                input.salutation as CustomerSalutationType,
            );
            const firstName = CustomerFirstName.create(input.firstName);
            const lastName = CustomerLastName.create(input.lastName);
            const email = CustomerEmail.create(input.email);
            const agreeToTerms = input.agreeToTerms;

            // Add customer to order
            const customer = Customer.create(salutation, firstName, lastName, email);

            order.addCustomer(agreeToTerms, customer);

            await this._uow.save(order);

            this._logger.info('Customer added to order successfully', { orderId: order.id.value });

            return `api/orders/${order.id.value}`;
        });

        return result;
    }
}
