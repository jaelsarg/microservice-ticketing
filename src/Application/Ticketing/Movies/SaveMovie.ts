import { Logger, UnitOfWork, UseCase } from '@/Application/Ports/mod.ts';
import {
    AgeRating,
    Genre,
    Movie,
    MovieDuration,
    MovieId,
    MovieTitle,
    PosterUrl,
} from '@/Domain/Ticketing/Movies/mod.ts';

export interface SaveMovieInput {
    id: string;
    title: string;
    duration: number;
    genres: string[];
    ageRating: number;
    posterUrl: string;
}

export class SaveMovie implements UseCase<SaveMovieInput, void> {
    private readonly _uow: UnitOfWork;
    private readonly _logger: Logger;

    constructor(uow: UnitOfWork, logger: Logger) {
        this._uow = uow;
        this._logger = logger;
    }

    async execute(input: SaveMovieInput): Promise<void> {
        this._logger.info('Starting movie saving process', { input });

        return await this._uow.do<void>(async () => {
            const movieId = MovieId.create(input.id);
            const movieTitle = MovieTitle.create(input.title);
            const movieDuration = MovieDuration.create(input.duration);
            const movieGenres = input.genres.map((genre) => Genre.create(genre));
            const movieAgeRating = AgeRating.create(input.ageRating);
            const moviePosterUrl = PosterUrl.create(input.posterUrl);

            const movie = Movie.create(
                movieId,
                movieTitle,
                movieDuration,
                movieGenres,
                movieAgeRating,
                moviePosterUrl,
            );

            await this._uow.save(movie);

            this._logger.info('Movie saved successfully', { movieId: movie.id.value });
        });
    }
}
