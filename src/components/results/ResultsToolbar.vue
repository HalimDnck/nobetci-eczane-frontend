<script setup lang="ts">
import type { Language } from '../../i18n';
import { messages } from '../../i18n';
import type { RadiusKm, ViewMode } from '../../types/ui';
import { radiusOptions } from '../../types/ui';
import ViewTabs from '../ViewTabs.vue';

defineProps<{
  activeView: ViewMode;
  contextLabel: string;
  language: Language;
  lastUpdatedLabel: string;
  radiusKm: RadiusKm;
  resultCount: number;
}>();

const emit = defineEmits<{
  back: [];
  home: [];
  'update:activeView': [view: ViewMode];
  'update:radiusKm': [radiusKm: RadiusKm];
}>();
</script>

<template>
  <section class="result-summary" aria-live="polite">
    <div>
      <strong>{{ resultCount }} {{ messages[language].found }}</strong>
      <span>{{ contextLabel }}</span>
      <span v-if="lastUpdatedLabel"
        >{{ messages[language].lastUpdated }}: {{ lastUpdatedLabel }}</span
      >
    </div>

    <div class="result-actions">
      <div class="radius-toggle" role="group" :aria-label="messages[language].radiusLabel">
        <span>{{ messages[language].radius }}</span>
        <button
          v-for="item in radiusOptions"
          :key="item"
          type="button"
          :class="{ active: radiusKm === item }"
          :aria-pressed="radiusKm === item"
          @click="emit('update:radiusKm', item)"
        >
          {{ item }} km
        </button>
      </div>
      <button
        v-if="activeView === 'map'"
        class="ghost-button mobile-only"
        type="button"
        @click="emit('back')"
      >
        {{ messages[language].back }}
      </button>
      <button class="ghost-button" type="button" @click="emit('home')">
        {{ messages[language].mainMenu }}
      </button>
      <ViewTabs
        :model-value="activeView"
        :language="language"
        @update:model-value="emit('update:activeView', $event)"
      />
    </div>
  </section>
</template>
