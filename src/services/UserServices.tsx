import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Address } from "./AddressServices";
import { Payment } from "./PaymentServices";
import { db } from "./config";

interface ActiveJob {
  settlerServiceId: string;
  catalogueId: string;
}

export interface User {
  uid: string;
  email: string;
  userName: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  accountType: string;
  isVerified: boolean;
  profileImageUrl?: string;
  createAt: any;
  updatedAt: any;
  memberFor: string;
  currentAddress?: Address;
  currentPayment?: Payment;
  activeJobs?: ActiveJob[];
}

export async function fetchAllUsers(): Promise<User[]> {
  try {
    const usersRef = collection(db, "users")
    const q = query(usersRef, orderBy("createAt", "desc"))
    const snapshot = await getDocs(q)

    const users: User[] = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
    })) as User[]

    return users
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}