import { ValueObject } from '@/Domain/Shared/mod.ts';
import {
    AgeRating,
    Genre,
    Money,
    MovieDuration,
    MovieId,
    MovieTitle,
    PosterUrl,
} from '@/Domain/Ticketing/Movies/mod.ts';

export class MovieInfo extends ValueObject {
    private readonly _movieId: MovieId;
    private readonly _title: MovieTitle;
    private readonly _duration: MovieDuration;
    private readonly _genres: Genre[];
    private readonly _posterUrl: PosterUrl;
    private readonly _ageRating: AgeRating;
    private readonly _price: Money;

    private constructor(
        movieId: MovieId,
        title: MovieTitle,
        duration: MovieDuration,
        genres: Genre[],
        posterUrl: PosterUrl,
        ageRating: AgeRating,
        price: Money,
    ) {
        super();
        this._movieId = movieId;
        this._title = title;
        this._duration = duration;
        this._genres = genres;
        this._posterUrl = posterUrl;
        this._ageRating = ageRating;
        this._price = price;
    }

    static create(
        movieId: MovieId,
        title: MovieTitle,
        duration: MovieDuration,
        genres: Genre[],
        posterUrl: PosterUrl,
        ageRating: AgeRating,
        price: Money,
    ): MovieInfo {
        const movieInfo = new MovieInfo(
            movieId,
            title,
            duration,
            genres,
            posterUrl,
            ageRating,
            price,
        );

        return movieInfo;
    }

    get movieId(): MovieId {
        return this._movieId;
    }

    get title(): MovieTitle {
        return this._title;
    }

    get duration(): MovieDuration {
        return this._duration;
    }

    get genres(): Genre[] {
        return this._genres;
    }

    get posterUrl(): PosterUrl {
        return this._posterUrl;
    }

    get ageRating(): AgeRating {
        return this._ageRating;
    }

    get price(): Money {
        return this._price;
    }

    override equals(other: MovieInfo): boolean {
        return this._movieId.equals(other._movieId);
    }
}
