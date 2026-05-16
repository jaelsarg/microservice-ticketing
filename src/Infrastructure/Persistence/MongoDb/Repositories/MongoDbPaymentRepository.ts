import {
    MongoDbClient,
    MongoDbRepository,
} from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import { Payment, PaymentRepository } from '@/Domain/Ticketing/Payments/mod.ts';
import { PaymentDocumentMapper } from '@/Infrastructure/Persistence/MongoDb/Repositories/mod.ts';

export class MongoDbPaymentRepository extends MongoDbRepository<Payment>
    implements PaymentRepository {
    public static override collectionName: string = 'payments';

    constructor(
        client: MongoDbClient,
        documentMapper: PaymentDocumentMapper,
    ) {
        super(
            client,
            documentMapper,
            MongoDbPaymentRepository.collectionName,
        );
    }

    override get entityName(): string {
        return 'Payment';
    }
}
