
export interface SubOption {
  id?: number;
  label: string;        // e.g. "10 sqft"
  additionalPrice: number; // e.g. 15 (store as number for calculations)
  notes?: string;       // optional: "measure carefully"
  isCompleted?: boolean;
}

export interface DynamicOption {
  id?: number;
  name: string;          // e.g. "sqft", "extras"
  subOptions: SubOption[];
  multipleSelect: boolean;
}

export interface Catalogue {
  // main attributes
  id?: string;
  imageUrls: string[];
  title: string;
  description: string;
  includedServices: string;
  excludedServices: string;
  category: string;
  basePrice: number;

  //the dynamic attributes
  dynamicOptions: DynamicOption[];

  //records
  isActive: boolean;
  bookingsCount: number;
  averageRatings: number;
  createAt: any;
  updateAt: any;
}
