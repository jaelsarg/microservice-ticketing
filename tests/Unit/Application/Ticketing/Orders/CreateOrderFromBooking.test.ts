import { Logger } from '@/Application/Ports/mod.ts';
import { createMockMovieRepository, createMockOrderRepository } from '@/tests/Unit/Application/Shared/Repositories/mod.ts';
import { createMockDomainEventBus, createMockUnitOfWork } from '@/tests/Unit/Application/Shared/mod.ts';
import { CreateOrderFromBooking } from '@/Application/Ticketing/Orders/mod.ts';
import { assertEquals, assertRejects } from '@std/assert';
import { AggregateRoot, EntityId, Repository } from '@/Domain/Shared/mod.ts';
import { MovieNotFoundException } from '@/Domain/Ticketing/Movies/MovieExceptions.ts';
import { AgeRating, Genre, Movie, MovieDuration, MovieId, MovieTitle, PosterUrl } from '@/Domain/Ticketing/Movies/mod.ts';
import { Optional } from '@domaincrafters/std';
import { InvalidSeatNumberException } from '@/Domain/Ticketing/Orders/OrderExceptions.ts';

const createLogger = (): { logger: Logger; calls: Record<string, number> } => {
    const calls = {
        debug: 0,
        info: 0,
        warn: 0,
        error: 0,
    };

    const logger: Logger = {
        debug: () => calls.debug++,
        info: () => calls.info++,
        warn: () => calls.warn++,
        error: () => calls.error++,
    };

    return { logger, calls };
};

Deno.test('[Unit] - CreateOrderFromBooking - valid input - creates order', async () => {
    // Arrange
    const movie = Movie.create(
        MovieId.create('4442d8e5-f939-4f07-9b14-aa83f49d0d34'),
        MovieTitle.create('Inception'),
        MovieDuration.create(148),
        [Genre.create('Action'), Genre.create('Sci-Fi')],
        AgeRating.create(13),
        PosterUrl.create('https://example.com/inception.jpg'),
    );
    const mockMovieRepo = createMockMovieRepository({
        byId: (_id) => {
            console.log('Mock byId called with:', _id);
            return Promise.resolve(Optional.of<Movie>(movie));
        }
    });
    const mockOrderRepo = createMockOrderRepository();
    const repositories = new Map<string, Repository<AggregateRoot<EntityId>, EntityId>>();
    repositories.set('Movie', mockMovieRepo);
    repositories.set('Order', mockOrderRepo);
    const mockEventBus = createMockDomainEventBus();
    const mockUnitOfWork = createMockUnitOfWork({
        eventBus: mockEventBus,
        repositories,
    });
    const { logger } = createLogger();
    const useCase = new CreateOrderFromBooking(mockUnitOfWork, logger);
    const input = {
        bookingId: '7223d951-548d-44d5-b6d2-ddc6c50e4d6d',
        movieId: '4442d8e5-f939-4f07-9b14-aa83f49d0d34',
        room: 'Blue room',
        showtime: new Date('2024-07-01T19:00:00Z'),
        standardVisitors: 2,
        discountedVisitors: 1,
        seatNumbers: [1, 2, 3],
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    assertEquals(typeof result, 'string');
    assertEquals(mockUnitOfWork.doCalled, true);
    assertEquals(mockUnitOfWork.saveCalled, true);
    assertEquals(mockOrderRepo.saveCalled, true);
});

Deno.test('[Unit] - CreateOrderFromBooking - non-existent movie - throws error', async () => {
    // Arrange
    const mockMovieRepo = createMockMovieRepository({});
    const mockOrderRepo = createMockOrderRepository();
    const repositories = new Map<string, Repository<AggregateRoot<EntityId>, EntityId>>();
    repositories.set('Movie', mockMovieRepo);
    repositories.set('Order', mockOrderRepo);
    const mockEventBus = createMockDomainEventBus();
    const mockUnitOfWork = createMockUnitOfWork({
        eventBus: mockEventBus,
        repositories,
    });
    const { logger } = createLogger();
    const useCase = new CreateOrderFromBooking(mockUnitOfWork, logger);
    const input = {
        bookingId: '7223d951-548d-44d5-b6d2-ddc6c50e4d6d',
        movieId: '4442d8e5-f939-4f07-9b14-aa83f49d0d34',
        room: 'Blue room',
        showtime: new Date('2024-07-01T19:00:00Z'),
        standardVisitors: 2,
        discountedVisitors: 1,
        seatNumbers: [1, 2, 3],
    };

    // Act & Assert
    await assertRejects(
        () => useCase.execute(input),
        MovieNotFoundException,
    );
    assertEquals(mockUnitOfWork.saveCalled, false);
});

Deno.test('[Unit] - CreateOrderFromBooking - missing seat number - throw InvalidSeatNumberException', async () => {
    // Arrange
    const movie = Movie.create(
        MovieId.create('4442d8e5-f939-4f07-9b14-aa83f49d0d34'),
        MovieTitle.create('Inception'),
        MovieDuration.create(148),
        [Genre.create('Action'), Genre.create('Sci-Fi')],
        AgeRating.create(13),
        PosterUrl.create('https://example.com/inception.jpg'),
    );
    const mockMovieRepo = createMockMovieRepository({
        byId: (_id) => {
            console.log('Mock byId called with:', _id);
            return Promise.resolve(Optional.of<Movie>(movie));
        }
    });
    const mockOrderRepo = createMockOrderRepository();
    const repositories = new Map<string, Repository<AggregateRoot<EntityId>, EntityId>>();
    repositories.set('Movie', mockMovieRepo);
    repositories.set('Order', mockOrderRepo);
    const mockEventBus = createMockDomainEventBus();
    const mockUnitOfWork = createMockUnitOfWork({
        eventBus: mockEventBus,
        repositories,
    });
    const { logger } = createLogger();
    const useCase = new CreateOrderFromBooking(mockUnitOfWork, logger);
    const input = {
        bookingId: '7223d951-548d-44d5-b6d2-ddc6c50e4d6d',
        movieId: '4442d8e5-f939-4f07-9b14-aa83f49d0d34',
        room: 'Blue room',
        showtime: new Date('2024-07-01T19:00:00Z'),
        standardVisitors: 2,
        discountedVisitors: 1,
        seatNumbers: [],
    };

    // Act & Assert
    await assertRejects(
        () => useCase.execute(input),
        InvalidSeatNumberException,
    );
});