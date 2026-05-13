import { ValueObject } from '@/Domain/Shared/mod.ts';
import {
    CustomerEmail,
    CustomerFirstName,
    CustomerLastName,
    CustomerSalutation,
} from '@/Domain/Ticketing/Orders/mod.ts';

export class Customer extends ValueObject {
    private readonly _salutation: CustomerSalutation;
    private readonly _firstName: CustomerFirstName;
    private readonly _lastName: CustomerLastName;
    private readonly _email: CustomerEmail;

    private constructor(
        salutation: CustomerSalutation,
        firstName: CustomerFirstName,
        lastName: CustomerLastName,
        email: CustomerEmail,
    ) {
        super();
        this._salutation = salutation;
        this._firstName = firstName;
        this._lastName = lastName;
        this._email = email;
    }

    static create(
        salutation: CustomerSalutation,
        firstName: CustomerFirstName,
        lastName: CustomerLastName,
        email: CustomerEmail,
    ): Customer {
        const customer = new Customer(
            salutation,
            firstName,
            lastName,
            email,
        );

        return customer;
    }

    get salutation(): CustomerSalutation {
        return this._salutation;
    }

    get firstName(): CustomerFirstName {
        return this._firstName;
    }

    get lastName(): CustomerLastName {
        return this._lastName;
    }

    get email(): CustomerEmail {
        return this._email;
    }

    override equals(other: Customer): boolean {
        return !!other &&
            this._salutation.equals(other._salutation) &&
            this._firstName.equals(other._firstName) &&
            this._lastName.equals(other._lastName) &&
            this._email.equals(other._email);
    }
}
