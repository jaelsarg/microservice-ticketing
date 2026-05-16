import { ValueObject } from '@/Domain/Shared/mod.ts';
import { InvalidPaymentStatusTransitionException } from '@/Domain/Ticketing/Payments/mod.ts';

export enum PaymentStatusState {
    Pending = 'Pending',
    Success = 'Success',
    Failed = 'Failed',
}

export class PaymentStatus extends ValueObject {
    private readonly _value: PaymentStatusState;

    private constructor(value: PaymentStatusState) {
        super();
        this._value = value;
    }

    static create(value: PaymentStatusState): PaymentStatus {
        const paymentStatus = new PaymentStatus(value);
        return paymentStatus;
    }

    get value(): PaymentStatusState {
        return this._value;
    }

    static readonly Pending = new PaymentStatus(PaymentStatusState.Pending);
    static readonly Success = new PaymentStatus(PaymentStatusState.Success);
    static readonly Failed = new PaymentStatus(PaymentStatusState.Failed);

    transitionTo(targetStatus: PaymentStatus): PaymentStatus {
        if (!this.canTransitionTo(targetStatus)) {
            throw new InvalidPaymentStatusTransitionException(this._value, targetStatus.value);
        }

        return targetStatus;
    }

    private canTransitionTo(targetStatus: PaymentStatus): boolean {
        const validTransitions: Record<PaymentStatusState, PaymentStatusState[]> = {
            [PaymentStatusState.Pending]: [
                PaymentStatusState.Success,
                PaymentStatusState.Failed,
            ],
            [PaymentStatusState.Success]: [],
            [PaymentStatusState.Failed]: [],
        };

        return validTransitions[this._value].includes(targetStatus._value);
    }

    override equals(other: PaymentStatus): boolean {
        return this._value === other._value;
    }
}
