<script setup lang="ts">
import type { Language } from '../i18n';
import { messages } from '../i18n';

type ViewMode = 'list' | 'map';

defineProps<{
  language: Language;
  modelValue: ViewMode;
}>();

const emit = defineEmits<{
  'update:modelValue': [view: ViewMode];
}>();
</script>

<template>
  <div class="view-toggle" role="tablist" aria-label="View">
    <button
      type="button"
      :class="{ active: modelValue === 'list' }"
      role="tab"
      :aria-selected="modelValue === 'list'"
      @click="emit('update:modelValue', 'list')"
    >
      {{ messages[language].list }}
    </button>
    <button
      type="button"
      :class="{ active: modelValue === 'map' }"
      role="tab"
      :aria-selected="modelValue === 'map'"
      @click="emit('update:modelValue', 'map')"
    >
      {{ messages[language].map }}
    </button>
  </div>
</template>
