import { Customer, CustomerEmail, CustomerFirstName, CustomerLastName, CustomerSalutation } from '@/Domain/Ticketing/Orders/mod.ts';
import { CustomerSalutationType } from '@/Domain/Ticketing/Orders/ValueObjects/CustomerSalutation.ts';
import { assertEquals } from '@std/assert';

Deno.test('[Unit] - Customer - create - valid values - returns Customer value object', () => {
    // Arrange
    const salutation = CustomerSalutation.create(CustomerSalutationType.Mr);
    const firstName = CustomerFirstName.create("Jerôme");
    const lastName = CustomerLastName.create("Hendryckx")
    const email = CustomerEmail.create("jerome.hendryckx@email.com");

    // Act
    const customer = Customer.create(salutation, firstName, lastName, email);

    // Assert
    assertEquals(customer.salutation, salutation);
    assertEquals(customer.firstName, firstName);
    assertEquals(customer.lastName, lastName);
    assertEquals(customer.email, email);
});

Deno.test('[Unit] - Customer - equals - same value - returns true', () => {
    // Arrange
    const left = Customer.create(
        CustomerSalutation.create(CustomerSalutationType.Mr),
        CustomerFirstName.create("Jerôme"),
        CustomerLastName.create("Hendryckx"),
        CustomerEmail.create("jerome.hendryckx@email.com")
    );

    const right = Customer.create(
        CustomerSalutation.create(CustomerSalutationType.Mr),
        CustomerFirstName.create("Jerôme"),
        CustomerLastName.create("Hendryckx"),
        CustomerEmail.create("jerome.hendryckx@email.com")
    );

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - Customer - equals - different value - returns false', () => {
    // Arrange
    const left = Customer.create(
        CustomerSalutation.create(CustomerSalutationType.Mr),
        CustomerFirstName.create("Jerôme"),
        CustomerLastName.create("Hendryckx"),
        CustomerEmail.create("jerome.hendryckx@email.com")
    );

    const right = Customer.create(
        CustomerSalutation.create(CustomerSalutationType.Ms),
        CustomerFirstName.create("Jerôme"),
        CustomerLastName.create("Hendryckx"),
        CustomerEmail.create("jerome.hendryckx@email.com")
    );

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});