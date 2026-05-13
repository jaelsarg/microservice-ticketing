import { ValueObject } from '@/Domain/Shared/mod.ts';
import { InvalidSeatNumberException, VisitorType } from '@/Domain/Ticketing/Orders/mod.ts';

export class Seat extends ValueObject {
    private readonly _seatNumber: number;
    private readonly _visitorType: VisitorType;

    private constructor(seatNumber: number, visitorType: VisitorType) {
        super();
        this._seatNumber = seatNumber;
        this._visitorType = visitorType;
    }

    static create(seatNumber: number, visitorType: VisitorType): Seat {
        const seat = new Seat(seatNumber, visitorType);
        seat.validate();
        return seat;
    }

    private validate(): void {
        if (this._seatNumber <= 0) {
            throw new InvalidSeatNumberException(this._seatNumber);
        }
    }

    get seatNumber(): number {
        return this._seatNumber;
    }

    get visitorType(): VisitorType {
        return this._visitorType;
    }

    override equals(other: Seat): boolean {
        return !!other &&
            this._seatNumber === other._seatNumber &&
            this._visitorType.equals(other._visitorType);
    }
}
