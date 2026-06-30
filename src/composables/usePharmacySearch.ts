import { computed, ref, watch, type ComputedRef, type Ref } from 'vue';
import { districtsByProvince } from '../data/mockPharmacies';
import { getNearbyPharmacies, searchPharmacies } from '../services/pharmacyService';
import type { Coordinates, Pharmacy } from '../types/pharmacy';
import type { RadiusKm, SearchMode } from '../types/ui';

interface UsePharmacySearchOptions {
  coordinates: Ref<Coordinates | null>;
  loadErrorMessage: ComputedRef<string>;
  searchErrorMessage: ComputedRef<string>;
}

const networkErrorMessages = new Set([
  'Failed to fetch',
  'NetworkError when attempting to fetch resource.',
  'Load failed',
]);

function userFacingErrorMessage(error: unknown, fallbackMessage: string) {
  if (!(error instanceof Error)) {
    return fallbackMessage;
  }

  if (networkErrorMessages.has(error.message)) {
    return fallbackMessage;
  }

  return error.message || fallbackMessage;
}

export function usePharmacySearch({
  coordinates,
  loadErrorMessage,
  searchErrorMessage,
}: UsePharmacySearchOptions) {
  const pharmacies = ref<Pharmacy[]>([]);
  const selectedId = ref<string>('');
  const isLoading = ref(false);
  const pageError = ref('');
  const searchMode = ref<SearchMode>('district');
  const radiusKm = ref<RadiusKm>(3);
  const province = ref('Istanbul');
  const district = ref('Kadikoy');

  const availableDistricts = computed(() => districtsByProvince[province.value] ?? []);
  const selectedPharmacy = computed(() =>
    pharmacies.value.find((pharmacy) => pharmacy.id === selectedId.value),
  );

  watch(province, () => {
    district.value = availableDistricts.value[0] ?? '';
  });

  async function loadNearby(nextCoordinates = coordinates.value) {
    if (!nextCoordinates) {
      return;
    }

    pharmacies.value = await getNearbyPharmacies(nextCoordinates, radiusKm.value);
    selectedId.value = pharmacies.value[0]?.id ?? '';
    searchMode.value = 'nearby';
  }

  async function loadByDistrict() {
    if (!province.value || !district.value) {
      return;
    }

    isLoading.value = true;
    pageError.value = '';

    try {
      pharmacies.value = await searchPharmacies({
        province: province.value,
        district: district.value,
      });
      selectedId.value = pharmacies.value[0]?.id ?? '';
      searchMode.value = 'district';
    } catch (error) {
      pageError.value = userFacingErrorMessage(error, searchErrorMessage.value);
    } finally {
      isLoading.value = false;
    }
  }

  async function loadWithLocation(requestLocation: () => Promise<Coordinates | null>) {
    isLoading.value = true;
    pageError.value = '';

    try {
      const nextCoordinates = await requestLocation();
      if (!nextCoordinates) {
        return false;
      }

      await loadNearby(nextCoordinates);
      return true;
    } catch (error) {
      pageError.value = userFacingErrorMessage(error, loadErrorMessage.value);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function selectPharmacy(pharmacy: Pharmacy) {
    selectedId.value = pharmacy.id;
  }

  watch(radiusKm, async () => {
    if (searchMode.value !== 'nearby' || !coordinates.value) {
      return;
    }

    isLoading.value = true;
    pageError.value = '';

    try {
      await loadNearby();
    } catch (error) {
      pageError.value = userFacingErrorMessage(error, loadErrorMessage.value);
    } finally {
      isLoading.value = false;
    }
  });

  return {
    availableDistricts,
    district,
    isLoading,
    loadByDistrict,
    loadNearby,
    loadWithLocation,
    pageError,
    pharmacies,
    province,
    radiusKm,
    searchMode,
    selectPharmacy,
    selectedId,
    selectedPharmacy,
  };
}
