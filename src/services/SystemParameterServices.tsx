import { collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./config";

export interface SettlerResource {
    imageUri: string;
    title: string;
    description: string;
    link: string;
}

export interface SystemParameter {
    platformFee: number;
    platformFeeIsActive: boolean;
    showAdminApproveBookingButton: boolean;
    showAssignSettlerButton: boolean;
    faqLink: string;
    customerSupportLink: string;
    settlerResources: SettlerResource[];
}

export const fetchSystemParameters = async (): Promise<SystemParameter> => {
    const systemParamsRef = collection(db, "system_parameters");
    const snapshot = await getDocs(systemParamsRef);
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
        platformFee: data.platformFee,
        platformFeeIsActive: data.platformFeeIsActive,
        showAdminApproveBookingButton: data.showAdminApproveBookingButton,
        showAssignSettlerButton: data.showAssignSettlerButton,
        faqLink: data.faqLink,
        customerSupportLink: data.customerSupportLink,
        settlerResources: data.settlerResources || [],
    };
}

export const updateSystemParameters = async (params: Partial<SystemParameter>): Promise<void> => {
    const systemParamsRef = collection(db, "system_parameters");
    const snapshot = await getDocs(systemParamsRef);
    const docRef = snapshot.docs[0].ref;
    await updateDoc(docRef, params);
}