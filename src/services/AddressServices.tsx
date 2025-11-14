import { collection, getDocs } from "firebase/firestore";
import { db } from "./config";

export interface Address {
  id?: string;
  latitude: number;
  longitude: number;
  addressName: string;
  address: string;
  buildingType: string;
  fullAddress: string;
  postcode: string;
  addressLabel: string;
  phoneNumber: string;
  createAt: any;  // Use the Firebase Timestamp object for createAt
  updatedAt: any;  // Use the Firebase Timestamp object for updatedAt
}

export const fetchUserAddresses = async (userId: string): Promise<Address[]> => {
  try {
    const userAddressesRef = collection(db, 'users', userId, 'addresses');
    const querySnapshot = await getDocs(userAddressesRef);

    const addresses: Address[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      addresses.push({
        id: docSnap.id,
        latitude: data.latitude,
        longitude: data.longitude,
        addressName: data.addressName,
        address: data.address,
        buildingType: data.buildingType,
        fullAddress: data.fullAddress,
        postcode: data.postcode,
        addressLabel: data.addressLabel,
        phoneNumber: data.phoneNumber,
        createAt: data.createAt,
        updatedAt: data.updatedAt,
      });
    });

    return addresses;
  } catch (error) {
    console.error('Error fetching addresses: ', error);
    return [];
  }
};