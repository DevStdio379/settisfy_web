export interface Payment {
    id?: string;
    accountHolder: string;       // Full Name
    bankName: string;            // Issuing Bank
    accountNumber: string;       // Bank Account Number
    accountType: 'personal' | 'business';
    createdAt: any;              // Firebase Timestamp
    updatedAt: any;              // Firebase Timestamp
}
