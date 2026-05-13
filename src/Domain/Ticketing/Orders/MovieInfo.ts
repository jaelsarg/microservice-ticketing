import { Entity, UUIDEntityId } from '@/Domain/Shared/mod.ts';
import {
    AgeRating,
    Genre,
    Money,
    MovieDuration,
    MovieTitle,
    PosterUrl,
} from '@/Domain/Ticketing/Movies/mod.ts';

export class MovieInfoId extends UUIDEntityId {
    private constructor(id?: string) {
        super(id);
    }

    static create(id?: string): MovieInfoId {
        return new MovieInfoId(id);
    }
}

export class MovieInfo extends Entity<MovieInfoId> {
    private readonly _title: MovieTitle;
    private readonly _duration: MovieDuration;
    private readonly _genres: Genre[];
    private readonly _posterUrl: PosterUrl;
    private readonly _ageRating: AgeRating;
    private readonly _price: Money;

    private constructor(
        id: MovieInfoId,
        title: MovieTitle,
        duration: MovieDuration,
        genres: Genre[],
        posterUrl: PosterUrl,
        ageRating: AgeRating,
        price: Money,
    ) {
        super(id);
        this._title = title;
        this._duration = duration;
        this._genres = genres;
        this._posterUrl = posterUrl;
        this._ageRating = ageRating;
        this._price = price;
    }

    static create(
        title: MovieTitle,
        duration: MovieDuration,
        genres: Genre[],
        posterUrl: PosterUrl,
        ageRating: AgeRating,
        price: Money,
    ): MovieInfo {
        const movieInfo = new MovieInfo(
            MovieInfoId.create(),
            title,
            duration,
            genres,
            posterUrl,
            ageRating,
            price,
        );

        return movieInfo;
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
}
