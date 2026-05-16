import {
    AgeRating,
    Genre,
    Money,
    Movie,
    MovieDuration,
    MovieId,
    MovieTitle,
    PosterUrl,
} from '@/Domain/Ticketing/Movies/mod.ts';
import {
    DocumentMapper,
    serializeObjectToDocument,
} from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import { Document } from '@mongodb';

export class MovieDocumentMapper implements DocumentMapper<Movie> {
    // Convert a Movie aggregate to a MongoDB document
    toDocument(movie: Movie): Document {
        const document = serializeObjectToDocument({
            _id: movie.id.toString(),
            title: movie.title.value,
            duration: movie.duration.value,
            genres: movie.genres.map((genre) => genre.value),
            ageRating: movie.ageRating.value,
            posterUrl: movie.posterUrl.value,
            price: movie.price.value,
        });

        return document;
    }

    // Reconstitute a Movie aggregate from a MongoDB document
    reconstitute(document: Document): Movie {
        const movie = this.reconstituteFromDocument(
            (document.id ?? document._id) as string,
            document.title,
            document.duration,
            document.genres,
            document.ageRating,
            document.posterUrl,
            document.price,
        );

        return movie;
    }

    private reconstituteFromDocument(
        id: string,
        title: string,
        duration: number,
        genres: string[],
        ageRating: number,
        posterUrl: string,
        price: number,
    ): Movie {
        const movie = Object.create(Movie.prototype);

        movie['_id'] = MovieId.create(id);
        movie['_title'] = MovieTitle.create(title);
        movie['_duration'] = MovieDuration.create(duration);
        movie['_genres'] = genres.map((genre) => Genre.create(genre));
        movie['_ageRating'] = AgeRating.create(ageRating);
        movie['_posterUrl'] = PosterUrl.create(posterUrl);
        movie['_price'] = Money.create(price);

        return movie;
    }
}
