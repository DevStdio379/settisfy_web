import { collection, getDocs, updateDoc } from "firebase/firestore";
import { db, storage } from "./config";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

export interface SettlerResource {
    imageUri: string;
    title: string;
    description: string;
    link: string;
}

export interface ServiceCategory {
    label: string;
    value: string;
    imageUrl: string;
}

export interface ServiceArea {
    name: string;
    postcodePrefixes: string;
}

export interface SystemParameter {
    platformFee: number;
    platformFeeIsActive: boolean;
    showAdminApproveBookingButton: boolean;
    showAssignSettlerButton: boolean;
    faqLink: string;
    customerSupportLink: string;
    settlerResources: SettlerResource[];
    serviceAreas: ServiceArea[];
    serviceCategories: ServiceCategory[];
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
        serviceAreas: data.serviceAreas || [],
        serviceCategories: data.serviceCategories || [],
    };
}


export const uploadImage = async (imageName: string, uri: string): Promise<string> => {
  if (uri.startsWith("https://")) return uri; // Already uploaded

  const response = await fetch(uri);
  const blob = await response.blob();

  const filename = `service_category/${imageName}_${Date.now()}.jpg`;
  const storageRef = ref(storage, filename);

  const uploadTask = uploadBytesResumable(storageRef, blob);

  await new Promise<void>((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      () => {},
      reject,
      resolve
    );
  });

  return await getDownloadURL(uploadTask.snapshot.ref);
};



export const updateSystemParameters = async (params: Partial<SystemParameter>): Promise<void> => {
  const systemParamsRef = collection(db, "system_parameters");
  const snapshot = await getDocs(systemParamsRef);
  const docRef = snapshot.docs[0].ref;

  if (params.serviceCategories) {
    const updatedCategories = [];

    for (const category of params.serviceCategories) {
      const uploadedUrl = await uploadImage(category.label, category.imageUrl);

      updatedCategories.push({
        ...category,
        imageUrl: uploadedUrl,
      });
    }

    params.serviceCategories = updatedCategories;
  }

  await updateDoc(docRef, params);
};
