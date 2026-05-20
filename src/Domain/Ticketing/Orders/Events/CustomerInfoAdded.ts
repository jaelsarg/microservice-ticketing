import { OrderDomainEvent } from '@/Domain/Ticketing/Orders/mod.ts';
import { EventFQDN } from '../../../Shared/mod.ts';

export class CustomerInfoAdded extends OrderDomainEvent {
    static readonly FQDN: EventFQDN = EventFQDN.create(
        `${OrderDomainEvent.FQDN_PREFIX}.customerinfoadded`,
    );

    private readonly _orderId: string;
    private readonly _salutation: string;
    private readonly _firstName: string;
    private readonly _lastName: string;
    private readonly _email: string;
    private readonly _occurredOn: Date;

    private constructor(
        orderId: string,
        salutation: string,
        firstName: string,
        lastName: string,
        email: string,
    ) {
        super();
        this._orderId = orderId;
        this._salutation = salutation;
        this._firstName = firstName;
        this._lastName = lastName;
        this._email = email;
        this._occurredOn = new Date();
    }

    static create(
        orderId: string,
        salutation: string,
        firstName: string,
        lastName: string,
        email: string,
    ): CustomerInfoAdded {
        return new CustomerInfoAdded(orderId, salutation, firstName, lastName, email);
    }

    override get FQDN(): EventFQDN {
        return CustomerInfoAdded.FQDN;
    }

    override get occurredOn(): Date {
        return this._occurredOn;
    }

    get orderId(): string {
        return this._orderId;
    }

    get salutation(): string {
        return this._salutation;
    }

    get firstName(): string {
        return this._firstName;
    }

    get lastName(): string {
        return this._lastName;
    }

    get email(): string {
        return this._email;
    }
}
