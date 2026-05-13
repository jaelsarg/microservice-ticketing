import { Logger } from '@/Application/Ports/mod.ts';
import { createMockMovieRepository } from '@/tests/Unit/Application/Shared/Repositories/mod.ts';
import { createMockDomainEventBus, createMockUnitOfWork } from '@/tests/Unit/Application/Shared/mod.ts';
import { SaveMovie } from '@/Application/Ticketing/Movies/mod.ts';
import { assertEquals } from '@std/assert';

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

Deno.test('[Unit] - SaveMovie - valid input - creates movie', async () => {
    // Arrange
    const mockMovieRepo = createMockMovieRepository();
    const repositories = new Map([['Movie', mockMovieRepo]]);
    const mockEventBus = createMockDomainEventBus();
    const mockUnitOfWork = createMockUnitOfWork({
        eventBus: mockEventBus,
        repositories,
    });
    const { logger } = createLogger();
    const useCase = new SaveMovie(mockUnitOfWork, logger);
    const input = {
        id: '4442d8e5-f939-4f07-9b14-aa83f49d0d34',
        title: 'Inception',
        duration: 148,
        genres: ['Action', 'Sci-Fi'],
        ageRating: 13,
        posterUrl: 'https://example.com/inception.jpg',
    };

    // Act
    await useCase.execute(input);

    // Assert
    assertEquals(mockUnitOfWork.doCalled, true);
    assertEquals(mockUnitOfWork.saveCalled, true);
    assertEquals(mockMovieRepo.saveCalled, true);
});