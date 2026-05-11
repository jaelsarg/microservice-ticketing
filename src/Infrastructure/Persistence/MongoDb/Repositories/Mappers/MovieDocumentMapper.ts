import { AgeRating, Genre, Movie, MovieDuration, MovieId, MovieTitle, PosterUrl } from '@/Domain/Ticketing/Movies/mod.ts';
import { DocumentMapper, serializeObjectToDocument } from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import { Document } from '@mongodb';

export class MovieDocumentMapper implements DocumentMapper<Movie> {
    // Convert a Movie aggregate to a MongoDB document
    toDocument(movie: Movie): Document {
        const document = serializeObjectToDocument({
            id: movie.id.toString(),
            title: movie.title.value,
            duration: movie.duration.value,
            genres: movie.genres.map(genre => genre.value),
            ageRating: movie.ageRating.value,
            posterUrl: movie.posterUrl.value,
            price: movie.price.value
        });

        return document;
    }
    
    // Reconstitute a Movie aggregate from a MongoDB document
    reconstitute(document: Document): Movie {
        const movie = this.reconstituteFromDocument(
            document.id,
            document.title,
            document.duration,
            document.genres,
            document.ageRating,
            document.posterUrl
        );

        return movie;
    }    

    private reconstituteFromDocument(
        id: string,
        titel: string,
        duration: number,
        genres: string[],
        ageRating: number,
        posterUrl: string
    ): Movie {
        const movie = Object.create(Movie.prototype);

        movie['_id'] = MovieId.create(id);
        movie['_title'] = MovieTitle.create(titel);
        movie['_duration'] = MovieDuration.create(duration);
        movie['_genres'] = genres.map(genre => Genre.create(genre));
        movie['_ageRating'] = AgeRating.create(ageRating);
        movie['_posterUrl'] = PosterUrl.create(posterUrl);

        return movie;
    }
}