<script setup lang="ts">
import type { Language } from '../../i18n';
import { messages } from '../../i18n';

defineProps<{
  language: Language;
}>();
</script>

<template>
  <div class="state-card empty-state">
    <div class="state-logo state-logo--muted">E</div>
    <h2>{{ messages[language].noResultsTitle }}</h2>
    <p>{{ messages[language].noResults }}</p>
  </div>
</template>
