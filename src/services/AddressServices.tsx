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