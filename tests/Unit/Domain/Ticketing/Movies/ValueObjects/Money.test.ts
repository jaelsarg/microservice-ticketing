import { InvalidMoneyException, Money } from '@/Domain/Ticketing/Movies/mod.ts';
import { assertEquals, assertThrows } from '@std/assert';

Deno.test('[Unit] - Money - create - valid value - returns Money value object', () => {
    // Arrange
    const validMoney = 12;

    // Act
    const money = Money.create(validMoney);

    // Assert
    assertEquals(money.value, validMoney);
});

Deno.test('[Unit] - Money - create - invalid value - throws InvalidMoneyException', () => {
    // Arrange
    const invalidMoney = -10;

    // Act & Assert
    assertThrows(
        () => Money.create(invalidMoney),
        InvalidMoneyException
    );
});

Deno.test('[Unit] - Money - equals - same value - returns true', () => {
    // Arrange
    const left = Money.create(12);
    const right = Money.create(12);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - Money - equals - different value - returns false', () => {
    // Arrange
    const left = Money.create(12);
    const right = Money.create(16);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});