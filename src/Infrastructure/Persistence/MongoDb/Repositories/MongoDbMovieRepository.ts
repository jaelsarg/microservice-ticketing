import { Movie, MovieId, MovieRepository } from '@/Domain/Ticketing/Movies/mod.ts';
import { MongoDbClient, MongoDbRepository } from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import { MovieDocumentMapper } from '@/Infrastructure/Persistence/MongoDb/Repositories/mod.ts';

export class MongoDbMovieRepository extends MongoDbRepository<Movie, MovieId> implements MovieRepository {
    public static override collectionName: string = 'movies';

    constructor(
        client: MongoDbClient,
        documentMapper: MovieDocumentMapper
    ) {
        super(
            client,
            documentMapper,
            MongoDbMovieRepository.collectionName
        );
    }
    
    override get entityName(): string {
        return 'Movie';
    }
}