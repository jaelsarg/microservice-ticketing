import {
    DocumentMapper,
    serializeObjectToDocument,
} from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import {
    CardNumber,
    CVV,
    ExpiryDate,
    ExternalId,
    Payment,
    PaymentAmount,
    PaymentId,
    PaymentStatus,
    PaymentStatusState,
} from '@/Domain/Ticketing/Payments/mod.ts';
import { Document } from '@mongodb';
import { BookingId, OrderId } from '@/Domain/Ticketing/Orders/mod.ts';
import {
    PaymentMethod,
    PaymentMethodType,
} from '@/Domain/Ticketing/Payments/ValueObjects/PaymentMethod.ts';

export class PaymentDocumentMapper implements DocumentMapper<Payment> {
    // Convert a Payment aggregate to a MongoDB document
    toDocument(entity: Payment): Document {
        const document = serializeObjectToDocument({
            _id: entity.id.value,
            externalId: entity.externalId.value,
            paymentMethod: entity.paymentMethod.value,
            cardNumber: entity.cardNumber.value,
            expiryDate: entity.expiryDate.value,
            cvv: entity.cvv.value,
            orderId: entity.orderId.value,
            bookingId: entity.bookingId.value,
            amount: entity.amount.value,
            status: entity.status.value,
        });

        return document;
    }

    // Reconstitute a Payment aggregate from a MongoDB document
    reconstitute(document: Document): Payment {
        const payment = this.reconstituteFromDocument(
            (document.id ?? document._id) as string,
            document.externalId,
            document.paymentMethod,
            document.cardNumber,
            document.expiryDate,
            document.cvv,
            document.orderId,
            document.bookingId,
            document.amount,
            document.status,
        );

        return payment;
    }

    private reconstituteFromDocument(
        id: string,
        externalId: string,
        paymentMethod: string,
        cardNumber: string,
        expiryDate: string,
        cvv: string,
        orderId: string,
        bookingId: string,
        amount: number,
        status: string,
    ): Payment {
        const payment = Object.create(Payment.prototype);

        payment['_id'] = PaymentId.create(id);
        payment['_externalId'] = ExternalId.create(externalId);
        payment['_paymentMethod'] = PaymentMethod.create(paymentMethod as PaymentMethodType);
        payment['_cardNumber'] = CardNumber.create(cardNumber);
        payment['_expiryDate'] = ExpiryDate.create(expiryDate);
        payment['_cvv'] = CVV.create(cvv);
        payment['_orderId'] = OrderId.create(orderId);
        payment['_bookingId'] = BookingId.create(bookingId);
        payment['_amount'] = PaymentAmount.create(amount);
        payment['_status'] = PaymentStatus.create(status as PaymentStatusState);

        payment['_domainEvents'] = [];

        return payment;
    }
}
