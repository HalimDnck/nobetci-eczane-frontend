<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import EmptyState from './components/feedback/EmptyState.vue';
import ErrorState from './components/feedback/ErrorState.vue';
import LoadingScreen from './components/feedback/LoadingScreen.vue';
import NoticeMessage from './components/feedback/NoticeMessage.vue';
import AppHeader from './components/layout/AppHeader.vue';
import ResultsLayout from './components/results/ResultsLayout.vue';
import ResultsToolbar from './components/results/ResultsToolbar.vue';
import PermissionScreen from './components/search/PermissionScreen.vue';
import SearchPanel from './components/search/SearchPanel.vue';
import { useGeolocation } from './composables/useGeolocation';
import { usePharmacySearch } from './composables/usePharmacySearch';
import { provinces } from './data/mockPharmacies';
import type { Language } from './i18n';
import { messages } from './i18n';
import type { ThemeMode, ViewMode } from './types/ui';

type AppScreen = 'permission' | 'fallback' | 'loading' | 'results' | 'empty' | 'error';

const language = ref<Language>('tr');
const theme = ref<ThemeMode>('light');
const activeView = ref<ViewMode>('list');
const screen = ref<AppScreen>('permission');
const previousScreen = ref<AppScreen>('permission');
const retryAction = ref<() => Promise<void>>(async () => runDistrictSearch());

const {
  coordinates,
  errorMessage: locationErrorMessage,
  requestLocation,
  status,
} = useGeolocation();

const t = computed(() => messages[language.value]);
const loadErrorMessage = computed(() => t.value.loadError);
const searchErrorMessage = computed(() => t.value.searchError);

const search = usePharmacySearch({
  coordinates,
  loadErrorMessage,
  searchErrorMessage,
});

const lastUpdatedLabel = computed(() => {
  if (!search.selectedPharmacy.value) {
    return '';
  }

  return new Intl.DateTimeFormat(language.value === 'tr' ? 'tr-TR' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(search.selectedPharmacy.value.lastUpdatedAt));
});

const locationNotice = computed(() => {
  if (status.value === 'denied') {
    return t.value.locationDenied;
  }

  if (status.value === 'unsupported') {
    return t.value.locationUnsupported;
  }

  if (status.value === 'error') {
    return t.value.locationUnavailable;
  }

  return locationErrorMessage.value;
});

const resultContextLabel = computed(() => {
  if (search.searchMode.value === 'nearby') {
    return `${search.pharmacies.value.length} ${t.value.found} - ${search.radiusKm.value} km ${t.value.radiusSummary}`;
  }

  return `${search.province.value} / ${search.district.value}`;
});

function showLoading(from: AppScreen) {
  previousScreen.value = from;
  screen.value = 'loading';
}

function finishSearch() {
  activeView.value = 'list';
  screen.value = search.pageError.value
    ? 'error'
    : search.pharmacies.value.length > 0
      ? 'results'
      : 'empty';
}

async function runLocationSearch() {
  retryAction.value = runLocationSearch;
  showLoading(screen.value);
  const loaded = await search.loadWithLocation(requestLocation);

  if (!loaded && !search.pageError.value) {
    screen.value = 'fallback';
    return;
  }

  finishSearch();
}

async function runDistrictSearch() {
  retryAction.value = runDistrictSearch;
  showLoading(screen.value);
  await search.loadByDistrict();
  finishSearch();
}

function goFallback() {
  previousScreen.value = screen.value;
  screen.value = 'fallback';
}

function goHome() {
  activeView.value = 'list';
  screen.value = 'permission';
}

function goBack() {
  if (screen.value === 'results' && activeView.value === 'map') {
    activeView.value = 'list';
    return;
  }

  screen.value = previousScreen.value === 'loading' ? 'permission' : previousScreen.value;
}

watch(
  theme,
  (nextTheme) => {
    document.documentElement.dataset.theme = nextTheme;
  },
  { immediate: true },
);
</script>

<template>
  <PermissionScreen
    v-if="screen === 'permission'"
    v-model:language="language"
    v-model:theme="theme"
    :is-loading="search.isLoading.value"
    @allow="runLocationSearch"
    @deny="goFallback"
  />

  <LoadingScreen v-else-if="screen === 'loading'" :language="language" />

  <main v-else class="app-shell">
    <AppHeader
      v-model:language="language"
      v-model:theme="theme"
      :show-back="screen !== 'results'"
      :show-search="screen === 'results'"
      :subtitle="screen === 'results' ? t.locationSubtitle : t.fallbackSubtitle"
      @back="goBack"
      @home="goHome"
      @search="goFallback"
    />

    <template v-if="screen === 'fallback'">
      <NoticeMessage v-if="locationNotice" :message="locationNotice" />
      <SearchPanel
        v-model:province="search.province.value"
        v-model:district="search.district.value"
        :available-districts="search.availableDistricts.value"
        :is-loading="search.isLoading.value"
        :language="language"
        :provinces="provinces"
        :status="status"
        @district-search="runDistrictSearch"
        @location-search="runLocationSearch"
      />
    </template>

    <template v-else-if="screen === 'results'">
      <ResultsToolbar
        v-model:active-view="activeView"
        v-model:radius-km="search.radiusKm.value"
        :context-label="resultContextLabel"
        :language="language"
        :last-updated-label="lastUpdatedLabel"
        :result-count="search.pharmacies.value.length"
        @back="goBack"
        @home="goHome"
      />

      <ResultsLayout
        :active-view="activeView"
        :is-loading="search.isLoading.value"
        :language="language"
        :pharmacies="search.pharmacies.value"
        :selected-id="search.selectedId.value"
        :user-location="coordinates"
        @select="search.selectPharmacy"
      />
    </template>

    <EmptyState v-else-if="screen === 'empty'" :language="language" />
    <ErrorState
      v-else-if="screen === 'error'"
      :language="language"
      :message="search.pageError.value || t.loadError"
      @retry="retryAction"
    />
  </main>
</template>
