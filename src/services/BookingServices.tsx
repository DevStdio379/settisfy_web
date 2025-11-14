// src/firebase/bookings.ts
import { collection, getDocs, query, orderBy, getDoc, doc, updateDoc } from "firebase/firestore"
import { db, storage } from "./config"
import { Address } from "./AddressServices";
import { Catalogue, DynamicOption } from "./CatalogueServices";
import { fetchAllUsers, User } from "./UserServices";
import { SettlerService } from "./SettlerServiceServices";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export enum BookingActivityType {

  // booking process states
  NOTES_TO_SETTLER_UPDATED = "NOTES_TO_SETTLER_UPDATED",
  
  // booking verification states
  BOOKING_APPROVED = "BOOKING_APPROVED",
  BOOKING_REJECTED = "BOOKING_REJECTED",

  // initial booking state
  QUOTE_CREATED = "QUOTE_CREATED",
  SETTLER_ACCEPT = "SETTLER_ACCEPT",
  SETTLER_SELECTED = "SETTLER_SELECTED",

  // active service state
  SETTLER_SERVICE_START = "SETTLER_SERVICE_START",
  SETTLER_SERVICE_END = "SETTLER_SERVICE_END",
  SETTLER_EVIDENCE_SUBMITTED = "SETTLER_EVIDENCE_SUBMITTED",
  SETTLER_EVIDENCE_UPDATED = "SETTLER_EVIDENCE_UPDATED",

  // incompletion & completion state
  JOB_COMPLETED = "JOB_COMPLETED",
  JOB_INCOMPLETE = "JOB_INCOMPLETE",
  CUSTOMER_JOB_INCOMPLETE_UPDATED = "CUSTOMER_JOB_INCOMPLETE_UPDATED",
  CUSTOMER_REJECT_INCOMPLETION_RESOLVE = "CUSTOMER_REJECT_INCOMPLETION_RESOLVE",
  SETTLER_RESOLVE_INCOMPLETION = "SETTLER_RESOLVE_INCOMPLETION",
  SETTLER_UPDATE_INCOMPLETION_EVIDENCE = "SETTLER_UPDATE_INCOMPLETION_EVIDENCE",
  SETTLER_REJECT_INCOMPLETION = "SETTLER_REJECT_INCOMPLETION",
  CUSTOMER_CONFIRM_COMPLETION = "CUSTOMER_CONFIRM_COMPLETION",

  // cooldown states
  COOLDOWN_REPORT_SUBMITTED = "COOLDOWN_REPORT_SUBMITTED",
  CUSTOMER_COOLDOWN_REPORT_UPDATED = "CUSTOMER_COOLDOWN_REPORT_UPDATED",
  SETTLER_RESOLVE_COOLDOWN_REPORT = "SETTLER_RESOLVE_COOLDOWN_REPORT",
  SETTLER_UPDATE_COOLDOWN_REPORT_EVIDENCE = "SETTLER_UPDATE_COOLDOWN_REPORT_EVIDENCE",
  CUSTOMER_COOLDOWN_REPORT_NOT_RESOLVED = "CUSTOMER_COOLDOWN_REPORT_NOT_RESOLVED",
  COOLDOWN_REPORT_COMPLETED = "COOLDOWN_REPORT_COMPLETED",
  SETTLER_REJECT_COOLDOWN_REPORT = "SETTLER_REJECT_COOLDOWN_REPORT",
  
  // final states
  BOOKING_COMPLETED = "BOOKING_COMPLETED",
  BOOKING_CANCELLED = "BOOKING_CANCELLED",
  BOOKING_CANCELLED_BY_CUSTOMER = "BOOKING_CANCELLED_BY_CUSTOMER",
  BOOKING_CANCELLED_BY_SETTLER = "BOOKING_CANCELLED_BY_SETTLER",

  PAYMENT_RELEASED_TO_SETTLER = "PAYMENT_RELEASED_TO_SETTLER",
  PAYMENT_RELEASED_TO_CUSTOMER = "PAYMENT_RELEASED_TO_CUSTOMER",
  REPORT_SUBMITTED = "REPORT_SUBMITTED",
  STATUS_CHANGED = "STATUS_CHANGED",

  // extra states
  SETTLER_QUOTE_UPDATED = "SETTLER_QUOTE_UPDATED",
}

export interface Acceptor {
  settlerId: string;
  settlerServiceId: string;
  firstName: string;
  lastName: string;
  acceptedAt: string; // store as ISO string, or use Firestore Timestamp if needed
}

export interface AcceptorsWithDetails extends Acceptor {
  settler?: User
  service?: SettlerService
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

  // system parameters
  platformFeeIsActive?: boolean;
  platformFee?: number;

  // payment release
  paymentReleasedAmountToSettler?: number;
  paymentReleaseToSettlerEvidenceUrls?: string[];
  paymentReleasedAmountToCustomer?: number;
  paymentReleaseToCustomerEvidenceUrls?: string[];
  
  createAt: any;
  updatedAt: any;
}

export interface BookingWithUsers extends Booking {
  customer?: User
  settler?: User
}

export interface BookingDetailsLatestData extends Booking {
  acceptorsWithDetails?: AcceptorsWithDetails[]
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


export async function fetchBookingById(bookingId: string): Promise<Booking | null> {
  try {
    const bookingRef = doc(db, "bookings", bookingId)
    const bookingSnap = await getDoc(bookingRef)
    
    if (!bookingSnap.exists()) {
      return null
    }
    
    return {
      id: bookingSnap.id,
      ...bookingSnap.data(),
    } as Booking
  } catch (error) {
    console.error("Error fetching booking by ID:", error)
    return null
  }
}

export const uploadImages = async (imageName: string, imagesUrl: string[]) => {
  const urls: string[] = [];

  for (const uri of imagesUrl) {
    // Skip already uploaded URLs (those starting with https://)
    if (uri.startsWith('https://')) {
      urls.push(uri);
      continue;
    }

    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const filename = `bookings/${imageName}_${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);

      const uploadTask = uploadBytesResumable(storageRef, blob);

      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          snapshot => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload ${filename}: ${progress.toFixed(2)}% done`);
          },
          reject,
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            urls.push(downloadURL);
            resolve();
          }
        );
      });

    } catch (error) {
      console.error("Upload failed:", error);
    }
  }

  console.log("All images uploaded:", urls);
  return urls;
};

export async function updateBooking(
  bookingId: string,
  updates: Partial<Booking>
): Promise<void> {
  try {
    const bookingRef = doc(db, "bookings", bookingId)
    await updateDoc(bookingRef, updates)
  } catch (error) {
    console.error("Error updating booking:", error)
    throw error
  }
}