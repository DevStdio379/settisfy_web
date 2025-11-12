import { collection, getDocs } from "firebase/firestore";
import { Catalogue } from "./CatalogueServices";
import { db } from "./config";

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