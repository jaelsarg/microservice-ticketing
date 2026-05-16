import { Logger, UnitOfWork, UseCase } from '@/Application/Ports/mod.ts';
import {
    BookingId,
    OrderId,
    OrderNotFoundException,
    OrderRepository,
    OrderWithBookingNotFound,
} from '@/Domain/Ticketing/Orders/mod.ts';
import {
    CardNumber,
    CVV,
    ExpiryDate,
    ExternalId,
    Payment,
    PaymentAmount,
    PaymentMethod,
    PaymentMethodType,
} from '@/Domain/Ticketing/Payments/mod.ts';
import { PaymentRequest, PaymentService } from '@/Application/Ports/Gateways/mod.ts';

export interface PayOrderInput {
    externalId: string;
    paymentMethod: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    orderId: string;
    bookingId: string;
    amount: number;
}

export class PayOrder implements UseCase<PayOrderInput, string> {
    private readonly _uow: UnitOfWork;
    private readonly _logger: Logger;
    private readonly _paymentService: PaymentService;

    constructor(
        uow: UnitOfWork,
        logger: Logger,
        paymentService: PaymentService,
    ) {
        this._uow = uow;
        this._logger = logger;
        this._paymentService = paymentService;
    }

    async execute(input: PayOrderInput): Promise<string> {
        this._logger.info('Processing payment for order', { input });

        const result = await this._uow.do<string>(async () => {
            // Check if order exists
            const orderRepo = this._uow.getRepository<OrderRepository>('Order');
            const orderId = OrderId.create(input.orderId);
            const orderOptional = await orderRepo.byId(orderId);

            if (!orderOptional.isPresent) {
                throw new OrderNotFoundException(`Order with ID ${input.orderId} not found`);
            }

            const order = orderOptional.value;

            // Check if booking exists
            const bookingId = BookingId.create(input.bookingId);
            if (!order.bookingId.equals(bookingId)) {
                throw new OrderWithBookingNotFound(orderId.value, bookingId.value);
            }

            // Create payment
            const externalId = ExternalId.create(input.externalId);
            const paymentMethod = PaymentMethod.create(input.paymentMethod as PaymentMethodType);
            const cardNumber = CardNumber.create(input.cardNumber);
            const expiryDate = ExpiryDate.create(input.expiryDate);
            const cvv = CVV.create(input.cvv);
            const amount = PaymentAmount.create(input.amount);

            const payment = Payment.create(
                externalId,
                paymentMethod,
                cardNumber,
                expiryDate,
                cvv,
                orderId,
                bookingId,
                amount,
            );

            await this._uow.save(payment);

            // Call payment service
            const paymentRequest: PaymentRequest = {
                amount: amount.value,
                cardNumber: cardNumber.value,
                expiryDate: expiryDate.value,
                cvv: cvv.value,
                paymentMethod: paymentMethod.value,
            };
            const paymentResponse = await this._paymentService.pay(paymentRequest);

            if (paymentResponse.success) {
                payment.markAsSucceeded();
            } else {
                payment.markAsFailed(paymentResponse.failureReason!);
            }

            await this._uow.save(payment);

            this._logger.info('Payment processed successfully', { paymentId: payment.id.value });

            return `api/orders/${orderId.value}/payments/${payment.id.value}`;
        });

        return result;
    }
}
