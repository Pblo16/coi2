export interface BillingDetail {
    id?: number;
    policy_id: number | string;
    amount: string | number;
    type: string | number;
    billing_id?: number;
    policy?: any;
}

export interface Billing {
    id: number;
    details: string;
    account_type: string;
    account_type_text?: string;
    billingDetails: BillingDetail[];
}

export interface BillingForm {
    details: string;
    account_type: string;
    billingDetails: BillingDetail[];
}
