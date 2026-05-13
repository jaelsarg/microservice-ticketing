import { Order, OrderRepository } from '@/Domain/Ticketing/Orders/mod.ts';
import {
    MongoDbClient,
    MongoDbRepository,
} from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import { OrderDocumentMapper } from '@/Infrastructure/Persistence/MongoDb/Repositories/mod.ts';

export class MongoDbOrderRepository extends MongoDbRepository<Order> implements OrderRepository {
    public static override collectionName: string = 'orders';

    constructor(
        client: MongoDbClient,
        documentMapper: OrderDocumentMapper,
    ) {
        super(
            client,
            documentMapper,
            MongoDbOrderRepository.collectionName,
        );
    }

    override get entityName(): string {
        return 'Order';
    }
}
