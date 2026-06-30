<script setup lang="ts">
import type { Language } from '../../i18n';
import { messages } from '../../i18n';

defineProps<{
  language: Language;
}>();
</script>

<template>
  <section class="state-screen state-screen--loading">
    <div class="state-card">
      <div class="state-logo state-logo--pulse">E</div>
      <h1>{{ messages[language].locating }}</h1>
      <div class="loading-list" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  </section>
</template>
