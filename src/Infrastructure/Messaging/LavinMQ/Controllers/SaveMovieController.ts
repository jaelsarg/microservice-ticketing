import { AmqpController } from '@/Infrastructure/Messaging/LavinMQ/Shared/mod.ts';
import { SaveMovieInput } from '@/Application/Ticketing/Movies/mod.ts';
import { UseCase } from '@/Application/Ports/mod.ts';
import { Guard } from '@domaincrafters/std';

export interface SaveMovieRequest {
    movieId: string;
    title: string;
    releaseyear: number;
    duration: number;
    genres: string[];
    actors: string[];
    ageRating: number;
    posterUrl: string;
}

export class SaveMovieController implements AmqpController<SaveMovieRequest> {
    private readonly _useCase: UseCase<SaveMovieInput, void>;

    constructor(useCase: UseCase<SaveMovieInput, void>) {
        this._useCase = useCase;
    }

    async handle(request: SaveMovieRequest): Promise<void> {
        console.log('Received SaveMovieRequest:', request);
        this.validateRequest(request);

        const input: SaveMovieInput = this.mapRequestToInput(request);

        await this._useCase.execute(input);
    }

    private validateRequest(request: SaveMovieRequest): void {
        Guard.check(request.title, 'title').againstEmpty();
        Guard.check(request.duration, 'duration').againstNegative();
        Guard.check(request.genres, 'genres').againstEmpty();
        Guard.check(request.ageRating, 'ageRating').againstNegative();
        Guard.check(request.posterUrl, 'posterUrl').againstEmpty();
    }

    private mapRequestToInput(request: SaveMovieRequest): SaveMovieInput {
        return {
            id: request.movieId,
            title: request.title,
            duration: request.duration,
            genres: request.genres,
            ageRating: request.ageRating,
            posterUrl: request.posterUrl,
        }
    }
}