// src/firebase/bookings.ts
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "./config"
import { Address } from "./AddressServices";
import { Catalogue, DynamicOption } from "./CatalogueServices";
import { fetchAllUsers, User } from "./UserServices";

export interface Acceptor {
  settlerId: string;
  settlerServiceId: string;
  firstName: string;
  lastName: string;
  acceptedAt: string; // store as ISO string, or use Firestore Timestamp if needed
}

export enum BookingActorType {
  SETTLER = "SETTLER",
  CUSTOMER = "CUSTOMER",
  SYSTEM = "SYSTEM",
}

export interface Booking {
  id?: string;
  userId: string;
  status: number | string;
  selectedDate: string;
  selectedAddress: Address;
  firstName: string;
  lastName: string;
  catalogueService: Catalogue;
  total: number;
  addons?: DynamicOption[];
  paymentMethod: string;
  paymentIntentId?: string;
  paymentEvidence?: string[];
  paymentStatus?: string;
  notesToSettlerImageUrls?: string[];
  notesToSettler?: string;
  notesToSettlerStatus?: string;
  manualQuoteDescription: string;
  manualQuotePrice: number;
  isManualQuoteCompleted?: boolean;
  newAddons?: DynamicOption[];
  newManualQuoteDescription?: string;
  newManualQuotePrice?: number;
  newTotal?: number;
  incompletionReportImageUrls?: string[];
  incompletionReportRemark?: string;
  incompletionStatus?: string;
  incompletionResolvedImageUrls?: string[];
  incompletionResolvedRemark?: string;
  cooldownReportImageUrls?: string[];
  cooldownReportRemark?: string;
  cooldownStatus?: string;
  cooldownResolvedImageUrls?: string[];
  cooldownResolvedRemark?: string;
  isQuoteUpdateSuccess?: boolean;
  acceptors?: Acceptor[];
  settlerId?: string;
  settlerServiceId: string;
  settlerFirstName?: string;
  settlerLastName?: string;
  settlerEvidenceImageUrls: string[];
  settlerEvidenceRemark: string;
  serviceStartCode: string;
  serviceEndCode: string;
  problemReportRemark?: string;
  problemReportImageUrls?: string[];
  problemReportIsCompleted?: boolean;
  cancelReasons?: string[];
  cancelReasonText?: string;
  cancelReasonImageUrls?: string[];
  cancelActor?: BookingActorType;
  timeline: any[];
  createAt: any;
  updatedAt: any;
}

export interface BookingWithUsers extends Booking {
  customer?: User
  settler?: User
}

export async function fetchBookings(): Promise<Booking[]> {
  const bookingsRef = collection(db, "bookings")
  
  // optional: order by creation time
  const q = query(bookingsRef, orderBy("createAt", "desc"))

  const snapshot = await getDocs(q)
  const bookings: Booking[] = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Booking[]

  return bookings
}


export async function fetchBookingsWithUsers(): Promise<BookingWithUsers[]> {
  try {
    // Fetch both datasets in parallel
    const [bookings, users] = await Promise.all([fetchBookings(), fetchAllUsers()])

    // Create a quick lookup map of users
    const userMap: Record<string, User> = {}
    users.forEach(user => {
      userMap[user.uid] = user
    })

    // Attach customer and settler to each booking
    const bookingsWithUsers: BookingWithUsers[] = bookings.map(b => ({
      ...b,
      customer: userMap[b.userId],
      settler: b.settlerId ? userMap[b.settlerId] : undefined,
    }))

    return bookingsWithUsers
  } catch (error) {
    console.error("Error fetching bookings with users:", error)
    return []
  }
}
