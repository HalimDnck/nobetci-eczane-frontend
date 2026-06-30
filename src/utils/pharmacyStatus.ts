import type { Pharmacy, PharmacyStatus } from '../types/pharmacy';

export function normalizePharmacyStatus(pharmacy: Pharmacy): PharmacyStatus {
  return pharmacy.status ?? 'on-duty';
}

export function isClosedPharmacy(pharmacy: Pharmacy) {
  return normalizePharmacyStatus(pharmacy) === 'closed';
}

export function isAvailablePharmacy(pharmacy: Pharmacy) {
  return normalizePharmacyStatus(pharmacy) !== 'closed';
}
