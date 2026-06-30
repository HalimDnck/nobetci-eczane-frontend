<script setup lang="ts">
import type { Language } from '../../i18n';
import { messages } from '../../i18n';
import type { GeolocationStatus } from '../../composables/useGeolocation';

defineProps<{
  availableDistricts: string[];
  district: string;
  isLoading: boolean;
  language: Language;
  province: string;
  provinces: string[];
  status: GeolocationStatus;
}>();

const emit = defineEmits<{
  'update:province': [province: string];
  'update:district': [district: string];
  districtSearch: [];
  locationSearch: [];
}>();
</script>

<template>
  <section id="main-search" class="fallback-panel" aria-label="Il ve ilce ile arama">
    <div class="fallback-heading">
      <h1>{{ messages[language].fallbackTitle }}</h1>
      <p>{{ messages[language].fallbackSubtitle }}</p>
    </div>

    <div class="search-panel">
      <h2>{{ messages[language].fallbackRegion }}</h2>
      <label>
        <span>{{ messages[language].province }}</span>
        <select
          :value="province"
          @change="emit('update:province', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="item in provinces" :key="item" :value="item">{{ item }}</option>
        </select>
      </label>

      <label>
        <span>{{ messages[language].district }}</span>
        <select
          :value="district"
          @change="emit('update:district', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="item in availableDistricts" :key="item" :value="item">{{ item }}</option>
        </select>
      </label>

      <button
        class="button button--dark"
        type="button"
        :disabled="isLoading"
        @click="emit('districtSearch')"
      >
        {{ messages[language].searchDistrict }}
      </button>
    </div>

    <div class="info-card-grid">
      <article class="info-card">
        <span aria-hidden="true">09</span>
        <div>
          <h3>{{ messages[language].dutyHoursTitle }}</h3>
          <p>{{ messages[language].dutyHoursDescription }}</p>
        </div>
      </article>
      <article class="info-card">
        <span aria-hidden="true">E</span>
        <div>
          <h3>{{ messages[language].sourceTitle }}</h3>
          <p>{{ messages[language].sourceDescription }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
