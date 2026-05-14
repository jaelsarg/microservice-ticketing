import { Logger } from '@/Application/Ports/mod.ts';
import { AgeRating, Genre, Movie, MovieDuration, MovieId, MovieTitle, PosterUrl } from '@/Domain/Ticketing/Movies/mod.ts';
import { Optional } from '@domaincrafters/std';
import { createMockMovieRepository } from '@/tests/Unit/Application/Shared/Repositories/mod.ts';
import { Order, OrderNotFoundException, Ticket, VisitorType, VisitorTypeState } from '@/Domain/Ticketing/Orders/mod.ts';
import { MovieInfo } from '@/Domain/Ticketing/Orders/ValueObjects/MovieInfo.ts';
import { Seat } from '@/Domain/Ticketing/Orders/ValueObjects/Seat.ts';
import { BookingId } from '@/Domain/Ticketing/Orders/ValueObjects/BookingId.ts';
import { createMockOrderRepository } from '@/tests/Unit/Application/Shared/Repositories/MockOrderRepository.ts';
import { AggregateRoot, EntityId, Repository } from '@/Domain/Shared/mod.ts';
import { createMockDomainEventBus, createMockUnitOfWork } from '@/tests/Unit/Application/Shared/mod.ts';
import { AddCustomerToOrder } from '@/Application/Ticketing/Orders/mod.ts';
import { assertEquals, assertRejects } from '@std/assert';

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

Deno.test('[Unit] - AddCustomerToOrder - valid input - adds customer to order', async () => {
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
    const tickets = [
        Ticket.create(
            MovieInfo.create(
                movie.id,
                movie.title,
                movie.duration,
                movie.genres,
                movie.posterUrl,
                movie.ageRating,
                movie.price
            ),
            Seat.create(1, VisitorType.create(VisitorTypeState.Standard)),
            'Blue room',
            new Date('2024-07-01T19:00:00Z')
        ),
        Ticket.create(
            MovieInfo.create(
                movie.id,
                movie.title,
                movie.duration,
                movie.genres,
                movie.posterUrl,
                movie.ageRating,
                movie.price
            ),
            Seat.create(2, VisitorType.create(VisitorTypeState.Discounted)),
            'Blue room',
            new Date('2024-07-01T19:00:00Z')
        ),
    ]
    const order = Order.create(
        BookingId.create('7223d951-548d-44d5-b6d2-ddc6c50e4d6d'),
        tickets,
    );
    const mockOrderRepo = createMockOrderRepository({
        byId: (_id) => {
            console.log('Mock byId called with:', _id);
            return Promise.resolve(Optional.of<Order>(order));
        }
    });
    const repositories = new Map<string, Repository<AggregateRoot<EntityId>, EntityId>>();
    repositories.set('Movie', mockMovieRepo);
    repositories.set('Order', mockOrderRepo);
    const mockEventBus = createMockDomainEventBus();
    const mockUnitOfWork = createMockUnitOfWork({
        eventBus: mockEventBus,
        repositories,
    });
    const { logger } = createLogger();
    const useCase = new AddCustomerToOrder(mockUnitOfWork, logger);
    const input = {
        orderId: order.id.value,
        salutation: 'Mr.',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        agreeToTerms: true,
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    assertEquals(typeof result, 'string');
    assertEquals(mockUnitOfWork.doCalled, true);
    assertEquals(mockUnitOfWork.saveCalled, true);
    assertEquals(mockOrderRepo.saveCalled, true);
});

Deno.test('[Unit] - AddCustomerToOrder - non-existent order - throws OrderNotFoundException', async () => {
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
    const useCase = new AddCustomerToOrder(mockUnitOfWork, logger);
    const input = {
        orderId: '7223d951-548d-44d5-b6d2-ddc6c50e4d6d',
        salutation: 'Mr.',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        agreeToTerms: true,
    };

    // Act & Assert
    await assertRejects(
        () => useCase.execute(input),
        OrderNotFoundException,
    );
    assertEquals(mockUnitOfWork.saveCalled, false);
});