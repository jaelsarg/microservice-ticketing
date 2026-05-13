import { ValueObject } from '@/Domain/Shared/mod.ts';
import { InvalidBookingIdException } from '@/Domain/Ticketing/Orders/mod.ts';

export class BookingId extends ValueObject {
    private readonly _value: string;

    private constructor(value: string) {
        super();
        this._value = value;
    }

    static create(value: string): BookingId {
        const bookingId = new BookingId(value);
        bookingId.validate();
        return bookingId;
    }

    protected validate(): void {
        if (!this._value || this._value.trim() === '') {
            throw new InvalidBookingIdException();
        }
    }

    get value(): string {
        return this._value;
    }

    override equals(other: BookingId): boolean {
        return this._value === other._value;
    }
}
