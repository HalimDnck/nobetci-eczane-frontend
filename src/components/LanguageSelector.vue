<script setup lang="ts">
import type { Language } from '../i18n';

defineProps<{
  modelValue: Language;
}>();

const emit = defineEmits<{
  'update:modelValue': [language: Language];
}>();
</script>

<template>
  <div class="language-selector" aria-label="Language">
    <button
      type="button"
      :class="{ active: modelValue === 'tr' }"
      :aria-pressed="modelValue === 'tr'"
      @click="emit('update:modelValue', 'tr')"
    >
      TR
    </button>
    <button
      type="button"
      :class="{ active: modelValue === 'en' }"
      :aria-pressed="modelValue === 'en'"
      @click="emit('update:modelValue', 'en')"
    >
      EN
    </button>
  </div>
</template>
