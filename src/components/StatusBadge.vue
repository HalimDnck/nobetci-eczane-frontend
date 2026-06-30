<script setup lang="ts">
import type { Language } from '../i18n';
import { messages } from '../i18n';
import type { PharmacyStatus } from '../types/pharmacy';

defineProps<{
  language: Language;
  status: PharmacyStatus;
  stale?: boolean;
}>();
</script>

<template>
  <span class="status-badge" :class="`status-badge--${status}`">
    {{ messages[language].status[status] }}
    <small v-if="stale">{{ messages[language].stale }}</small>
  </span>
</template>
