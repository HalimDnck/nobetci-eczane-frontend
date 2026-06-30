import { describe, expect, it, vi } from 'vitest';
import { getNearbyPharmacies, searchPharmacies } from './pharmacyService';

describe('pharmacyService', () => {
  it('returns nearby mock pharmacies sorted by calculated distance', async () => {
    const items = await getNearbyPharmacies({ lat: 40.987, lng: 29.024 }, 5);
    const lastItem = items[items.length - 1];

    expect(items.length).toBeGreaterThan(0);
    expect(items[0].distanceKm).toBeLessThanOrEqual(lastItem?.distanceKm ?? 0);
    expect(items[0].directionsUrl).toContain('destination=');
  });

  it('filters mock pharmacies by district search', async () => {
    const items = await searchPharmacies({ province: 'Istanbul', district: 'Kadikoy' });

    expect(items).toHaveLength(3);
    expect(items.every((item) => item.address.includes('Kadikoy'))).toBe(true);
    expect(items.some((item) => item.status === 'closed')).toBe(true);
  });

  it('falls back to demo pharmacies when mock nearby search would be empty', async () => {
    const items = await getNearbyPharmacies({ lat: 39.9208, lng: 32.8541 }, 1);

    expect(items.length).toBeGreaterThan(0);
    expect(items.some((item) => item.source === 'mock')).toBe(true);
  });

  it('falls back to demo pharmacies when mock district search has no match', async () => {
    const items = await searchPharmacies({ province: 'Ankara', district: 'Cankaya' });

    expect(items.length).toBeGreaterThan(0);
    expect(items.some((item) => item.address.includes('Kadikoy'))).toBe(true);
  });

  it('keeps closed pharmacies behind available pharmacies', async () => {
    const items = await searchPharmacies({ province: 'Istanbul', district: 'Kadikoy' });
    const lastItem = items[items.length - 1];

    expect(lastItem?.status).toBe('closed');
  });

  it('keeps fetch free in default mock mode', async () => {
    const fetchSpy = vi.spyOn(window, 'fetch');

    await searchPharmacies({ province: 'Istanbul', district: 'Kadikoy' });

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
