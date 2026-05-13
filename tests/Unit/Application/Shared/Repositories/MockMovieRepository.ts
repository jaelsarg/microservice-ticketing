import { Optional } from '@domaincrafters/std';
import { Movie, MovieId, MovieRepository } from '@/Domain/Ticketing/Movies/mod.ts';

interface MockMovieRepositoryOptions {
    byName?: (name: string) => Promise<Optional<Movie>>;
    existsByName?: (name: string) => Promise<boolean>;
    save?: (movie: Movie) => Promise<void>;
    byId?: (id: MovieId) => Promise<Optional<Movie>>;
    remove?: (movie: Movie) => Promise<void>;
}

export class MockMovieRepository implements MovieRepository {
    saveCalled = false;
    savedMovie: Movie | null = null;
    removeCalled = false;
    removedMovie: Movie | null = null;

    constructor(private readonly options: MockMovieRepositoryOptions = {}) {}

    async byName(name: string): Promise<Optional<Movie>> {
        if (this.options.byName) {
            return this.options.byName(name);
        }
        return Optional.empty<Movie>();
    }

    async existsByName(name: string): Promise<boolean> {
        if (this.options.existsByName) {
            return this.options.existsByName(name);
        }
        const existing = await this.byName(name);
        return existing.isPresent;
    }

    async save(movie: Movie): Promise<void> {
        if (this.options.save) {
            return this.options.save(movie);
        }
        this.saveCalled = true;
        this.savedMovie = movie;
    }

    async byId(id: MovieId): Promise<Optional<Movie>> {
        if (this.options.byId) {
            console.log(this.options.byId(id));
            return this.options.byId(id);
        }
        return Optional.empty<Movie>();
    }

    async remove(movie: Movie): Promise<void> {
        if (this.options.remove) {
            return this.options.remove(movie);
        }
        this.removeCalled = true;
        this.removedMovie = movie;
    }
}

export function createMockMovieRepository(
    options: MockMovieRepositoryOptions = {},
): MockMovieRepository {
    return new MockMovieRepository(options);
}