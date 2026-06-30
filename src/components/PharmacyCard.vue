<script setup lang="ts">
import { computed } from 'vue';
import type { Language } from '../i18n';
import { messages } from '../i18n';
import type { Pharmacy } from '../types/pharmacy';
import { isClosedPharmacy, normalizePharmacyStatus } from '../utils/pharmacyStatus';
import StatusBadge from './StatusBadge.vue';

const props = defineProps<{
  language: Language;
  pharmacy: Pharmacy;
  selected?: boolean;
}>();

const emit = defineEmits<{
  select: [pharmacy: Pharmacy];
}>();

const isClosed = computed(() => isClosedPharmacy(props.pharmacy));
const normalizedStatus = computed(() => normalizePharmacyStatus(props.pharmacy));
</script>

<template>
  <article
    class="pharmacy-card"
    :class="{
      'pharmacy-card--selected': selected,
      'pharmacy-card--closed': isClosed,
      'pharmacy-card--available': !isClosed,
    }"
  >
    <button class="pharmacy-card__body" type="button" @click="emit('select', pharmacy)">
      <span class="pharmacy-card__meta">
        <span class="pharmacy-card__distance">{{ pharmacy.distanceKm.toFixed(1) }} km</span>
        <StatusBadge :language="language" :status="normalizedStatus" :stale="pharmacy.isStale" />
      </span>
      <h3>{{ pharmacy.name }}</h3>
      <p>{{ pharmacy.address }}</p>
      <small v-if="pharmacy.dataDate" class="pharmacy-card__date">
        {{ messages[language].dataDate }}: {{ pharmacy.dataDate }}
      </small>
    </button>

    <div class="pharmacy-card__actions">
      <a v-if="!isClosed" :href="`tel:${pharmacy.phone}`" class="pharmacy-card__phone">
        {{ pharmacy.phone }}
      </a>
      <span v-else class="pharmacy-card__phone pharmacy-card__phone--muted">
        {{ pharmacy.phone }}
      </span>
      <a
        :href="pharmacy.directionsUrl"
        class="button button--secondary pharmacy-card__direction"
        target="_blank"
        rel="noreferrer"
      >
        {{ messages[language].directions }}
      </a>
    </div>
  </article>
</template>
