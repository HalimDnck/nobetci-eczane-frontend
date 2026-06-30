import { describe, expect, it } from 'vitest';
import { normalizePharmacyStatus } from './pharmacyStatus';
import type { Pharmacy } from '../types/pharmacy';

const basePharmacy: Pharmacy = {
  id: 'mock',
  name: 'Mock Pharmacy',
  address: 'Mock Street',
  phone: '+90 555 000 00 00',
  latitude: 40,
  longitude: 29,
  distanceKm: 1,
  directionsUrl: 'https://example.com',
  source: 'test',
  lastUpdatedAt: '2026-06-30T00:00:00.000Z',
};

describe('pharmacyStatus', () => {
  it('defaults missing provider status to on-duty', () => {
    expect(normalizePharmacyStatus(basePharmacy)).toBe('on-duty');
  });

  it('preserves closed provider status', () => {
    expect(normalizePharmacyStatus({ ...basePharmacy, status: 'closed' })).toBe('closed');
  });
});
