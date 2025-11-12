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

export async function fetchListOfUsers(userIds: string[]): Promise<User[]> {
    try {
        if (userIds.length === 0) return []

        const usersRef = collection(db, "users")
        const snapshot = await getDocs(usersRef)
        
        const users: User[] = snapshot.docs
            .filter(doc => userIds.includes(doc.id))
            .map(doc => ({
                uid: doc.id,
                ...doc.data(),
            })) as User[]

        return users
    } catch (error) {
        console.error("Error fetching list of users:", error)
        return []
    }
}

export async function fetchSelectedUser(userId: string): Promise<User | null> {
    try {
        const usersRef = collection(db, "users")
        const snapshot = await getDocs(usersRef)
        
        const userDoc = snapshot.docs.find(doc => doc.id === userId)
        
        if (!userDoc) {
            return null
        }

        const user: User = {
            uid: userDoc.id,
            ...userDoc.data(),
        } as User

        return user
    } catch (error) {
        console.error("Error fetching selected user:", error)
        return null
    }
}