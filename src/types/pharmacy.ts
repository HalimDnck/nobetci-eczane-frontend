export type PharmacyStatus = 'on-duty' | 'open' | 'closed';

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  directionsUrl: string;
  source: string;
  lastUpdatedAt: string;
  status?: PharmacyStatus;
  isStale?: boolean;
  dataDate?: string;
}

export interface PharmacyResponse {
  items: Pharmacy[];
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface SearchLocation {
  province: string;
  district: string;
}
