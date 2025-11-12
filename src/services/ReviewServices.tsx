import { collection, getDocs } from "firebase/firestore";
import { db } from "./config";
import { fetchAllUsers, User } from "./UserServices";

export interface Review {
  id?: string;  // Add an optional id field
  bookingId: string;
  customerId: string;
  settlerId: string;
  catalogueServiceId: string;
  settlerServiceId: string;

  // borrowerReview
  customerOverallRating?: number;
  customerFeedback?: string[];
  customerOtherComment?: string;
  customerReviewImageUrls?: string[];
  customerCreateAt?: any;
  customerUpdatedAt?: any;
}

export interface ReviewWithUsers extends Review {
  customer?: User
}

export async function fetchSelectedReviews(settlerServiceId: string): Promise<ReviewWithUsers[]> {
    try {
        const reviewsRef = collection(db, "reviews")
        const snapshot = await getDocs(reviewsRef)
        
        const reviewDocs = snapshot.docs.filter(doc => doc.data().settlerServiceId === settlerServiceId)
        
        if (reviewDocs.length === 0) {
            console.log("No reviews found for settler service:", settlerServiceId)
            return []
        }
        
        const reviews: Review[] = reviewDocs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        } as Review))
        
        // Fetch all users
        const users = await fetchAllUsers()
        
        // Create a quick lookup map of users
        const userMap: Record<string, User> = {}
        users.forEach(user => {
            userMap[user.uid] = user
        })
        
        // Attach customer to each review
        const reviewsWithUsers: ReviewWithUsers[] = reviews.map(r => ({
            ...r,
            customer: userMap[r.customerId],
        }))
        
        return reviewsWithUsers
    } catch (error) {
        console.error("Error fetching selected reviews:", error)
        return []
    }
}