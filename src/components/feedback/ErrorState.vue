<script setup lang="ts">
import type { Language } from '../../i18n';
import { messages } from '../../i18n';

defineProps<{
  language: Language;
  message: string;
}>();

const emit = defineEmits<{
  retry: [];
}>();
</script>

<template>
  <section class="state-screen">
    <div class="state-card">
      <div class="state-logo state-logo--error">!</div>
      <h1>{{ messages[language].loadError }}</h1>
      <p>{{ message }}</p>
      <button class="button button--primary" type="button" @click="emit('retry')">
        {{ messages[language].retry }}
      </button>
    </div>
  </section>
</template>
