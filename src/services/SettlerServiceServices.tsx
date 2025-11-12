import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Catalogue } from "./CatalogueServices";
import { db } from "./config";
import { fetchAllUsers, User } from "./UserServices";

export interface SettlerService {
    id?: string;
    settlerId: string;
    settlerFirstName: string;
    settlerLastName: string;

    selectedCatalogue: Catalogue;
    serviceCardImageUrls: string[];
    serviceCardBrief: string;
    isAvailableImmediately: boolean;
    availableDays: string[];
    serviceStartTime: string;
    serviceEndTime: string;

    serviceLocation: string;

    qualifications: string[];
    isActive: boolean;
    jobsCount: number;
    averageRatings: number;
    createdAt: any;
    updatedAt: any;
    
}

export interface SettlerServicesWithUsers extends SettlerService {
  settler?: User
}


export async function fetchSettlerServices(): Promise<SettlerService[]> {
    try {
        const servicesRef = collection(db, "settler_services")
        const q = query(servicesRef, orderBy("createdAt", "desc"))

        const snapshot = await getDocs(q)
        const services: SettlerService[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as SettlerService[]

        console.log("Fetched settler services:", services.length)
        return services
    } catch (error) {
        console.error("Error fetching settler services:", error)
        try {
            const servicesRef = collection(db, "settler_services")
            const snapshot = await getDocs(servicesRef)
            const services: SettlerService[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as SettlerService[]
            console.log("Fetched settler services (fallback):", services.length)
            return services
        } catch (fallbackError) {
            console.error("Fallback fetch also failed:", fallbackError)
            return []
        }
    }
}


export async function fetchSettlerServicesWithUsers(): Promise<SettlerServicesWithUsers[]> {
        try {
                // Fetch both datasets in parallel
                const [services, users] = await Promise.all([fetchSettlerServices(), fetchAllUsers()])

                console.log("Services fetched:", services.length, "Users fetched:", users.length)

                // Create a quick lookup map of users
                const userMap: Record<string, User> = {}
                users.forEach(user => {
                    userMap[user.uid] = user
                })
        
                // Attach customer and settler to each booking
                const servicesWithUsers: SettlerServicesWithUsers[] = services.map(s => ({
                    ...s,
                    settler: s.settlerId ? userMap[s.settlerId] : undefined,
                }))

                return servicesWithUsers
            } catch (error) {
                console.error("Error fetching services with users:", error)
                return []
            }
}

export async function fetchListOfSettlerServices(userIds: string[]): Promise<SettlerService[]> {
    try {
        if (userIds.length === 0) return []

        const servicesRef = collection(db, "settler_services")
        const snapshot = await getDocs(servicesRef)

        const services: SettlerService[] = snapshot.docs
        .filter(doc => userIds.includes(doc.id))
            .map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as SettlerService[]

        return services
    } catch (error) {
        console.error("Error fetching list of settler services:", error)
        return []
    }
}

export async function fetchSelectedSettlerService(serviceId: string): Promise<SettlerService | null> {
    try {
        const servicesRef = collection(db, "settler_services")
        const snapshot = await getDocs(servicesRef)
        
        const serviceDoc = snapshot.docs.find(doc => doc.id === serviceId)
        
        if (!serviceDoc) {
            console.log("Service not found:", serviceId)
            return null
        }
        
        const service: SettlerService = {
            id: serviceDoc.id,
            ...serviceDoc.data(),
        } as SettlerService
        
        return service
    } catch (error) {
        console.error("Error fetching selected settler service:", error)
        return null
    }
}