import { mockPharmacies } from '../data/mockPharmacies';
import type { Coordinates, Pharmacy, PharmacyResponse, SearchLocation } from '../types/pharmacy';
import { isClosedPharmacy, normalizePharmacyStatus } from '../utils/pharmacyStatus';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

function buildDirectionsUrl(latitude: number, longitude: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function distanceKm(from: Coordinates, to: Coordinates) {
  const earthRadiusKm = 6371;
  const latDiff = toRadians(to.lat - from.lat);
  const lngDiff = toRadians(to.lng - from.lng);
  const fromLat = toRadians(from.lat);
  const toLat = toRadians(to.lat);
  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(lngDiff / 2) * Math.sin(lngDiff / 2);
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function requestPharmacies(path: string): Promise<Pharmacy[]> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error('Nobetci eczane bilgileri alinamadi.');
  }

  const data = (await response.json()) as PharmacyResponse;
  return data.items.map(normalizePharmacy);
}

function normalizePharmacy(pharmacy: Pharmacy): Pharmacy {
  return {
    ...pharmacy,
    directionsUrl:
      pharmacy.directionsUrl || buildDirectionsUrl(pharmacy.latitude, pharmacy.longitude),
    status: normalizePharmacyStatus(pharmacy),
  };
}

function sortByStatusAndDistance(a: Pharmacy, b: Pharmacy) {
  if (isClosedPharmacy(a) !== isClosedPharmacy(b)) {
    return isClosedPharmacy(a) ? 1 : -1;
  }

  return a.distanceKm - b.distanceKm;
}

export async function getNearbyPharmacies(
  coordinates: Coordinates,
  radiusKm = 10,
): Promise<Pharmacy[]> {
  if (!USE_MOCKS) {
    const params = new URLSearchParams({
      lat: String(coordinates.lat),
      lng: String(coordinates.lng),
      radiusKm: String(radiusKm),
    });
    return requestPharmacies(`/api/pharmacies/nearby?${params.toString()}`);
  }

  return mockPharmacies
    .map((pharmacy) => {
      const calculatedDistance = distanceKm(coordinates, {
        lat: pharmacy.latitude,
        lng: pharmacy.longitude,
      });

      return {
        ...normalizePharmacy(pharmacy),
        distanceKm: Number(calculatedDistance.toFixed(1)),
      };
    })
    .filter((pharmacy) => pharmacy.distanceKm <= radiusKm)
    .sort(sortByStatusAndDistance);
}

export async function searchPharmacies(location: SearchLocation): Promise<Pharmacy[]> {
  if (!USE_MOCKS) {
    const params = new URLSearchParams({
      province: location.province,
      district: location.district,
    });
    return requestPharmacies(`/api/pharmacies/search?${params.toString()}`);
  }

  const districtMatch = location.district.toLocaleLowerCase('tr-TR');
  return mockPharmacies
    .filter((pharmacy) => pharmacy.address.toLocaleLowerCase('tr-TR').includes(districtMatch))
    .map(normalizePharmacy)
    .sort(sortByStatusAndDistance);
}
