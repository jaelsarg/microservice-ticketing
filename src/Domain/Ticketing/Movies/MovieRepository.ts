import { Movie, MovieId } from '@/Domain/Ticketing/Movies/mod.ts';
import { Repository } from '@/Domain/Shared/mod.ts';

export interface MovieRepository extends Repository<Movie, MovieId> {}
