
export interface User {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  photoURL?: string;
}

export interface LocationData {
  divisionId: string;
  districtId: string;
  upazilaId: string;
}

export interface BookListing {
  id: string;
  title: string;
  author: string;
  subject: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  price: number;
  contactPhone: string;
  description: string;
  sellerId: string;
  sellerName: string;
  location: LocationData;
  createdAt: number;
  imageUrl?: string;
}

export interface Division {
  id: string;
  name: string;
}

export interface District {
  id: string;
  divisionId: string;
  name: string;
}

export interface Upazila {
  id: string;
  districtId: string;
  name: string;
}
