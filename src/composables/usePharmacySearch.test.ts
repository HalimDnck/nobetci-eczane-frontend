import { computed, ref } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePharmacySearch } from './usePharmacySearch';
import * as pharmacyService from '../services/pharmacyService';

describe('usePharmacySearch', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('uses localized fallback copy for browser fetch failures', async () => {
    vi.spyOn(pharmacyService, 'searchPharmacies').mockRejectedValue(new Error('Failed to fetch'));

    const search = usePharmacySearch({
      coordinates: ref(null),
      loadErrorMessage: computed(() => 'Pharmacies could not be loaded.'),
      searchErrorMessage: computed(() => 'District search could not be completed.'),
    });

    await search.loadByDistrict();

    expect(search.pageError.value).toBe('District search could not be completed.');
  });

  it('preserves intentional domain errors', async () => {
    vi.spyOn(pharmacyService, 'searchPharmacies').mockRejectedValue(
      new Error('Backend validation failed.'),
    );

    const search = usePharmacySearch({
      coordinates: ref(null),
      loadErrorMessage: computed(() => 'Pharmacies could not be loaded.'),
      searchErrorMessage: computed(() => 'District search could not be completed.'),
    });

    await search.loadByDistrict();

    expect(search.pageError.value).toBe('Backend validation failed.');
  });

  it('loads demo pharmacies for temporary mock previews', async () => {
    const search = usePharmacySearch({
      coordinates: ref(null),
      loadErrorMessage: computed(() => 'Pharmacies could not be loaded.'),
      searchErrorMessage: computed(() => 'District search could not be completed.'),
    });

    await search.loadDemoData();

    expect(search.searchMode.value).toBe('demo');
    expect(search.pharmacies.value.length).toBeGreaterThan(0);
    expect(search.selectedId.value).toBe(search.pharmacies.value[0]?.id);
  });
});
