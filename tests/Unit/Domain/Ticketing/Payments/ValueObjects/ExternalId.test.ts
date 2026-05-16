import { ExternalId, InvalidExternalIdException } from '@/Domain/Ticketing/Payments/mod.ts';
import { assertEquals, assertThrows } from '@std/assert';

Deno.test('[Unit] - ExternalId - create - valid value - returns ExternalId value object', () => {
    // Arrange
    const value = '1fb29a10-4fe7-4e56-81c7-ba217e6f4159';

    // Act
    const externalId = ExternalId.create(value);

    // Assert
    assertEquals(externalId.value, value);
});

Deno.test('[Unit] - ExternalId - create - invalid value - throws InvalidExternalIdException', () => {
    // Arrange
    const value = '';

    // Act & Assert
    assertThrows(
        () => ExternalId.create(value),
        InvalidExternalIdException
    );
});

Deno.test('[Unit] - ExternalId - equals - same value - returns true', () => {
    // Arrange
    const left = ExternalId.create('1fb29a10-4fe7-4e56-81c7-ba217e6f4159');
    const right = ExternalId.create('1fb29a10-4fe7-4e56-81c7-ba217e6f4159');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - ExternalId - equals - different value - returns false', () => {
    // Arrange
    const left = ExternalId.create('1fb29a10-4fe7-4e56-81c7-ba217e6f4159');
    const right = ExternalId.create('2fc3ab21-5gf8-5f67-92d8-cb328f7g5260');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});