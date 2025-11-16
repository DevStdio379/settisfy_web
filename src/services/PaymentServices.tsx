import { collection, getDocs } from "firebase/firestore";
import { db } from "./config";

export interface Payment {
    id?: string;
    accountHolder: string;       // Full Name
    bankName: string;            // Issuing Bank
    accountNumber: string;       // Bank Account Number
    accountType: 'personal' | 'business';
    createdAt: any;              // Firebase Timestamp
    updatedAt: any;              // Firebase Timestamp
}

export const fetchUserPayments = async (userId: string): Promise<Payment[]> => {
    try {
        const userPaymentsRef = collection(db, 'users', userId, 'payments');
        const querySnapshot = await getDocs(userPaymentsRef);

        const payments: Payment[] = [];
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            payments.push({
                id: docSnap.id,
                accountHolder: data.accountHolder,
                bankName: data.bankName,
                accountNumber: data.accountNumber,
                accountType: data.accountType,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            });
        });

        return payments;
    } catch (error) {
        console.error('Error fetching payment details: ', error);
        return [];
    }
};