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
});
