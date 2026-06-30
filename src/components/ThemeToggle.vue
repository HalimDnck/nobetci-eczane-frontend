<script setup lang="ts">
import type { Language } from '../i18n';
import { messages } from '../i18n';

defineProps<{
  language: Language;
  modelValue: 'light' | 'dark';
}>();

const emit = defineEmits<{
  'update:modelValue': [theme: 'light' | 'dark'];
}>();
</script>

<template>
  <button
    class="icon-toggle"
    type="button"
    :aria-label="
      modelValue === 'dark' ? messages[language].themeLight : messages[language].themeDark
    "
    @click="emit('update:modelValue', modelValue === 'dark' ? 'light' : 'dark')"
  >
    <span aria-hidden="true">{{ modelValue === 'dark' ? 'L' : 'D' }}</span>
  </button>
</template>
