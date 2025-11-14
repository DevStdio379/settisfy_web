import { collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./config";

export interface SystemParameter {
    platformFee: number;
    platformFeeIsActive: boolean;
}

export const fetchSystemParameters = async (): Promise<SystemParameter> => {
    const systemParamsRef = collection(db, "system_parameters");
    const snapshot = await getDocs(systemParamsRef);
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
        platformFee: data.platformFee,
        platformFeeIsActive: data.platformFeeIsActive,
    };
}

export const updateSystemParameters = async (params: Partial<SystemParameter>): Promise<void> => {
    const systemParamsRef = collection(db, "system_parameters");
    const snapshot = await getDocs(systemParamsRef);
    const docRef = snapshot.docs[0].ref;
    await updateDoc(docRef, params);
}