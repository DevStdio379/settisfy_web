import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db, storage } from "./config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export interface SubOption {
  id?: number;
  label: string;
  additionalPrice: number;
  notes?: string;
  isCompleted?: boolean;
}

export interface DynamicOption {
  id?: number;
  name: string;
  subOptions: SubOption[];
  multipleSelect: boolean;
}

export interface Catalogue {
  id?: string;
  imageUrls: string[];
  title: string;
  description: string;
  includedServices: string;
  excludedServices: string;
  category: string;
  basePrice: number;
  coolDownPeriodHours: number;
  dynamicOptions: DynamicOption[];
  isActive: boolean;
  bookingsCount: number;
  averageRatings: number;
  createAt: any;
  updateAt: any;
}

export const createCatalogue = async (data: Catalogue) => {
  try {
    const serviceRef = collection(db, 'catalogue');
    const docRef = await addDoc(serviceRef, data);

    if (data.imageUrls && data.imageUrls.length > 0) {
      const uploadedUrls = await uploadImages(docRef.id, data.imageUrls);
      await updateDoc(doc(db, 'catalogue', docRef.id), { imageUrls: uploadedUrls });
    }
    console.log('Catalogue saved successfully');
  } catch (error) {
    console.error('Error saving catalogue: ', error);
    throw error;  // Throwing the error to handle it at the call site
  }
}

const mapDocToCatalogue = (doc: any): Catalogue => {
  const data = doc.data()
  return {
    id: doc.id,
    imageUrls: data.imageUrls || [],
    title: data.title || '',
    description: data.description || '',
    includedServices: data.includedServices || '',
    excludedServices: data.excludedServices || '',
    category: data.category || '',
    basePrice: data.basePrice || 0,
    coolDownPeriodHours: data.coolDownPeriodHours || 0,
    dynamicOptions: data.dynamicOptions || [],
    isActive: data.isActive ?? true,
    bookingsCount: data.bookingsCount || 0,
    averageRatings: data.averageRatings || 0,
    createAt: data.createAt,
    updateAt: data.updateAt,
  }
}

export const fetchAllCatalogue = async (): Promise<Catalogue[]> => {
  try {
    const catalogueList: Catalogue[] = [];
    const snapshot = await getDocs(collection(db, 'catalogue')); // Fetch products from 'products' collection
    for (const doc of snapshot.docs) {
      const catalogue = mapDocToCatalogue(doc);
      catalogueList.push({ ...catalogue });
    }
    return catalogueList;
  } catch (error) {
    console.error('Error fetching catalogue: ', error);
    throw error;  // Throwing the error to handle it at the call site
  }
};

export const fetchSelectedCatalogue = async (serviceId: string): Promise<Catalogue> => {
  try {
    const catalogueRef = doc(db, 'catalogue', serviceId);
    const catalogueDoc = await getDoc(catalogueRef);

    if (catalogueDoc.exists() && catalogueDoc.data()) {
      return mapDocToCatalogue(catalogueDoc);
    } else {
      console.log('No such selected product exists.');
      throw new Error('Catalogue not found');
    }
  } catch (error) {
    console.error('Error fetching selected product: ', error);
    throw error;  // Throwing the error to handle it at the call site
  }
};

export const searchServices = async (queryStr: string): Promise<Catalogue[]> => {
  try {
    if (queryStr.length < 3) return []; // Prevent unnecessary queries for short strings

    const lowerCaseQuery = queryStr.toLowerCase();
    const productList: Catalogue[] = [];

    // Firestore does not support 'contains' search, so we fetch products in a paginated way
    const serviceSnapshot = await getDocs(collection(db, "catalogue"));

    // Convert Firestore snapshot to a list of products
    const allServices = serviceSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Catalogue[];

    // 🔍 Efficient filtering (case-insensitive) before returning the results
    const filteredProducts = allServices
      .filter(product =>
        product.isActive && (
          product.title.toLowerCase().includes(lowerCaseQuery) ||
          product.description.toLowerCase().includes(lowerCaseQuery) ||
          product.category.toLowerCase().includes(lowerCaseQuery)
        )
      );

    // Fetch review counts in parallel to reduce Firestore calls
    // await Promise.all(filteredProducts.map(async product => {
    //   if (product.id) {
    //     const reviewsSnapshot = await getDocs(collection(db, "products", product.id, "reviews"));
    //     productList.push({ ...product, ratingCount: reviewsSnapshot.size });
    //   }
    // }));

    return productList;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

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

      const filename = `catalogue_assets/${imageName}_${Date.now()}.jpg`;
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


export const updateCatalogue = async (catalogueId: string, updatedCatalogue: Partial<Catalogue>) => {
  try {
    const catalogueRef = doc(db, 'catalogue', catalogueId);

    let finalImageUrls: string[] = [];

    if (updatedCatalogue.imageUrls && updatedCatalogue.imageUrls.length > 0) {
      // Separate local images from already uploaded URLs
      const localImages = updatedCatalogue.imageUrls.filter(url => !url.startsWith('https://'));
      const existingImages = updatedCatalogue.imageUrls.filter(url => url.startsWith('https://'));

      // Upload only local images
      const uploadedUrls = localImages.length > 0
        ? await uploadImages(catalogueId, localImages)
        : [];

      // Combine existing + newly uploaded
      finalImageUrls = [...existingImages, ...uploadedUrls];

      // Limit to 5 images
      finalImageUrls = finalImageUrls.slice(0, 5);
    }

    await updateDoc(catalogueRef, {
      ...updatedCatalogue,
      imageUrls: finalImageUrls.length > 0 ? finalImageUrls : updatedCatalogue.imageUrls
    });

    console.log('Catalogue updated successfully');
  } catch (error) {
    console.error('Error updating catalogue: ', error);
    throw error;
  }
};


export const deleteCatalogue = async (catalogueId: string) => {
  try {
    const catalogueRef = doc(db, 'catalogue', catalogueId);
    await deleteDoc(catalogueRef);
    console.log('Catalogue deleted successfully');
  } catch (error) {
    console.error('Error deleting catalogue: ', error);
    throw error;
  }
};