export interface Subscription {
    status: string;
    billingHistory:{
        date: string;
        amount: number;
    }[];
}