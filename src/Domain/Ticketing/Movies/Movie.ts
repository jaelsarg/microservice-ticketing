import { AggregateRoot, UUIDEntityId } from '@/Domain/Shared/mod.ts';
import {
    AgeRating,
    Genre,
    InvalidGenreLengthException,
    Money,
    MovieDuration,
    MovieTitle,
    PosterUrl,
} from '@/Domain/Ticketing/Movies/mod.ts';

export class MovieId extends UUIDEntityId {
    private constructor(id?: string) {
        super(id);
    }

    static create(id?: string): MovieId {
        return new MovieId(id);
    }
}

export class Movie extends AggregateRoot<MovieId> {
    private static readonly BASE_PRICE: number = 0.15;

    private readonly _title: MovieTitle;
    private readonly _duration: MovieDuration;
    private readonly _genres: Genre[];
    private readonly _ageRating: AgeRating;
    private readonly _posterUrl: PosterUrl;
    private readonly _price: Money;

    private constructor(
        id: MovieId,
        title: MovieTitle,
        duration: MovieDuration,
        genres: Genre[],
        ageRating: AgeRating,
        posterUrl: PosterUrl,
        price: Money,
    ) {
        super(id);
        this._title = title;
        this._duration = duration;
        this._genres = genres;
        this._ageRating = ageRating;
        this._posterUrl = posterUrl;
        this._price = price;
    }

    static create(
        id: MovieId,
        title: MovieTitle,
        duration: MovieDuration,
        genres: Genre[],
        ageRating: AgeRating,
        posterUrl: PosterUrl,
    ): Movie {
        const movie = new Movie(
            id,
            title,
            duration,
            genres,
            ageRating,
            posterUrl,
            Money.create(this.BASE_PRICE * duration.value),
        );

        movie.validate();

        return movie;
    }

    protected validate(): void {
        if (this._genres.length === 0) {
            throw new InvalidGenreLengthException(this._genres.map((g) => g.value));
        }
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

    get ageRating(): AgeRating {
        return this._ageRating;
    }

    get posterUrl(): PosterUrl {
        return this._posterUrl;
    }

    get price(): Money {
        return this._price;
    }
}
