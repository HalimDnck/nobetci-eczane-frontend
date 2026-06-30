<script setup lang="ts">
import type { Language } from '../../i18n';
import type { Coordinates, Pharmacy } from '../../types/pharmacy';
import type { ViewMode } from '../../types/ui';
import EmptyState from '../feedback/EmptyState.vue';
import PharmacyCard from '../PharmacyCard.vue';
import PharmacyMap from '../PharmacyMap.vue';

defineProps<{
  activeView: ViewMode;
  isLoading: boolean;
  language: Language;
  pharmacies: Pharmacy[];
  selectedId: string;
  userLocation: Coordinates | null;
}>();

const emit = defineEmits<{
  select: [pharmacy: Pharmacy];
}>();
</script>

<template>
  <section class="content-grid">
    <div class="list-pane" :class="{ 'mobile-hidden': activeView !== 'list' }">
      <PharmacyCard
        v-for="pharmacy in pharmacies"
        :key="pharmacy.id"
        :language="language"
        :pharmacy="pharmacy"
        :selected="pharmacy.id === selectedId"
        @select="emit('select', $event)"
      />

      <EmptyState v-if="!isLoading && pharmacies.length === 0" :language="language" />
    </div>

    <div class="map-pane" :class="{ 'mobile-hidden': activeView !== 'map' }">
      <PharmacyMap
        :language="language"
        :pharmacies="pharmacies"
        :selected-id="selectedId"
        :user-location="userLocation"
        @select="emit('select', $event)"
      />
    </div>
  </section>
</template>
