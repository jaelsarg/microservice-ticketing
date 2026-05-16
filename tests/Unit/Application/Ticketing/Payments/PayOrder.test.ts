import { Logger } from '@/Application/Ports/mod.ts';
import { AgeRating, Genre, Movie, MovieDuration, MovieId, MovieTitle, PosterUrl } from '@/Domain/Ticketing/Movies/mod.ts';
import { createMockMovieRepository, createMockOrderRepository, createMockPaymentRepository } from '@/tests/Unit/Application/Shared/Repositories/mod.ts';
import { Optional } from '@domaincrafters/std';
import { BookingId, MovieInfo, Order, OrderNotFoundException, OrderWithBookingNotFound, Seat, Ticket, VisitorType, VisitorTypeState } from '@/Domain/Ticketing/Orders/mod.ts';
import { createMockUnitOfWork } from '@/tests/Unit/Application/Shared/MockUnitOfWork.ts';
import { createMockDomainEventBus, createMockOnlinePaymentService } from '@/tests/Unit/Application/Shared/mod.ts';
import { AggregateRoot, EntityId, Repository } from '@/Domain/Shared/mod.ts';
import { PayOrder } from '@/Application/Ticketing/Payments/mod.ts';
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

Deno.test('[Unit] - PayOrder - valid input - creates payment', async () => {
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
    const mockPaymentRepo = createMockPaymentRepository();
    const repositories = new Map<string, Repository<AggregateRoot<EntityId>, EntityId>>();
    repositories.set('Movie', mockMovieRepo);
    repositories.set('Order', mockOrderRepo);
    repositories.set('Payment', mockPaymentRepo);
    const mockEventBus = createMockDomainEventBus();
    const mockUnitOfWork = createMockUnitOfWork({
        eventBus: mockEventBus, repositories
    });
    const { logger } = createLogger();
    
    const paymentService = createMockOnlinePaymentService();
    const useCase = new PayOrder(mockUnitOfWork, logger, paymentService);

    const input = {
        externalId: 'f3a2cc66-efe1-4ce1-ae0a-fff3eaa2a048',
        paymentMethod: 'CreditCard',
        cardNumber: '4111111111111111',
        expiryDate: '12/25',
        cvv: '123',
        orderId: order.id.value,
        bookingId: order.bookingId.value,
        amount: 25.00,
    };    

    // Act
    const result = await useCase.execute(input);

    // Assert
    assertEquals(typeof result, 'string');
    assertEquals(mockUnitOfWork.doCalled, true);
    assertEquals(mockUnitOfWork.saveCalled, true);
    assertEquals(mockPaymentRepo.saveCalled, true);
});

Deno.test('[Unit] - PayOrder - non-existent order - throws OrderNotFoundException', async () => {
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

    const mockPaymentRepo = createMockPaymentRepository();
    const repositories = new Map<string, Repository<AggregateRoot<EntityId>, EntityId>>();
    repositories.set('Movie', mockMovieRepo);
    repositories.set('Order', mockOrderRepo);
    repositories.set('Payment', mockPaymentRepo);
    const mockEventBus = createMockDomainEventBus();
    const mockUnitOfWork = createMockUnitOfWork({
        eventBus: mockEventBus, repositories
    });
    const { logger } = createLogger();
    
    const paymentService = createMockOnlinePaymentService();
    const useCase = new PayOrder(mockUnitOfWork, logger, paymentService);

    const input = {
        externalId: 'f3a2cc66-efe1-4ce1-ae0a-fff3eaa2a048',
        paymentMethod: 'CreditCard',
        cardNumber: '4111111111111111',
        expiryDate: '12/25',
        cvv: '123',
        orderId: 'f3a2cc66-efe1-4ce1-ae0a-fff3eaa2a048',
        bookingId: '7223d951-548d-44d5-b6d2-ddc6c50e4d6d',
        amount: 25.00,
    };    

    // Act & Assert
    await assertRejects(
        () => useCase.execute(input),
        OrderNotFoundException,
    );
});

Deno.test('[Unit] - PayOrder - non-existent booking - throws OrderWithBookingNotFound', async () => {
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
    const mockPaymentRepo = createMockPaymentRepository();
    const repositories = new Map<string, Repository<AggregateRoot<EntityId>, EntityId>>();
    repositories.set('Movie', mockMovieRepo);
    repositories.set('Order', mockOrderRepo);
    repositories.set('Payment', mockPaymentRepo);
    const mockEventBus = createMockDomainEventBus();
    const mockUnitOfWork = createMockUnitOfWork({
        eventBus: mockEventBus, repositories
    });
    const { logger } = createLogger();
    
    const paymentService = createMockOnlinePaymentService();
    const useCase = new PayOrder(mockUnitOfWork, logger, paymentService);

    const input = {
        externalId: 'f3a2cc66-efe1-4ce1-ae0a-fff3eaa2a048',
        paymentMethod: 'CreditCard',
        cardNumber: '4111111111111111',
        expiryDate: '12/25',
        cvv: '123',
        orderId: order.id.value,
        bookingId: 'feda0447-81b0-4031-ae4f-3976fc1d86fe',
        amount: 25.00,
    };

    // Act & Assert
    await assertRejects(
        () => useCase.execute(input),
        OrderWithBookingNotFound,
    );
});
