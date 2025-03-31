import { BillingDetail } from '../types';

/**
 * Calculate the balance of billing details.
 * Debits (type 0) add to the balance, credits (type 1) subtract.
 * Returns 0 if balanced, positive if more debits than credits, negative if more credits than debits.
 */
export function calculateBalance(billingDetails: BillingDetail[]): number {
    if (!billingDetails || billingDetails.length === 0) return 0;

    return billingDetails.reduce((balance, detail) => {
        const amount = parseFloat(detail.amount as string) || 0;
        // Type 0 is debit (cargo), Type 1 is credit (abono)
        return detail.type === '0' || detail.type === 0
            ? balance + amount
            : balance - amount;
    }, 0);
}

/**
 * Checks if billing details are balanced (sum equals zero)
 */
export function isBalanced(billingDetails: BillingDetail[]): boolean {
    // Use a small epsilon value to handle floating point rounding errors
    const epsilon = 0.001;
    const balance = calculateBalance(billingDetails);
    return Math.abs(balance) < epsilon;
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount);
}
