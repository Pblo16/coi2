import { BillingDetail } from '../types';

/**
 * Calculates the balance of billing details
 * Positive balance means more debits than credits
 * Negative balance means more credits than debits
 */
export function calculateBalance(billingDetails: BillingDetail[]): number {
    if (!billingDetails || billingDetails.length === 0) {
        return 0;
    }

    return billingDetails.reduce((balance, detail) => {
        const amount = parseFloat(detail.amount.toString()) || 0;
        // Type 0 is debit (cargo), Type 1 is credit (abono)
        const type = parseInt(detail.type.toString());
        return balance + (type === 0 ? amount : -amount);
    }, 0);
}

/**
 * Checks if billing details are balanced (debits equal credits)
 */
export function isBalanced(billingDetails: BillingDetail[]): boolean {
    if (!billingDetails || billingDetails.length < 2) {
        return false;
    }

    const balance = calculateBalance(billingDetails);

    // Use a small epsilon value to handle floating point rounding errors
    const epsilon = 0.001;
    return Math.abs(balance) < epsilon;
}

/**
 * Format currency values for display
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(amount);
}
