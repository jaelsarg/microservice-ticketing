import { WhenSuggestionCreatedConsoleLogSuggestion } from '@/Application/Ticketing/Suggestions/mod.ts';
import { SuggestionCreatedDomainEvent } from '@/Domain/Ticketing/Suggestions/mod.ts';
import { PaymentSuccess } from '@/Domain/Ticketing/Payments/mod.ts';
import { WhenPaymentSucceededThenMarkOrderAsPaid } from '@/Application/Ticketing/Payments/mod.ts';

export const domainEventPolicies: Map<string, string[]> = new Map([
    [
        PaymentSuccess.FQDN.toString(),
        [WhenPaymentSucceededThenMarkOrderAsPaid.name],
    ],
    [
        SuggestionCreatedDomainEvent.FQDN_VALUE.toString(),
        [WhenSuggestionCreatedConsoleLogSuggestion.name],
    ],
]);
