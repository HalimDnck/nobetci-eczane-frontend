<script setup lang="ts">
defineProps<{
  tone?: 'info' | 'error';
  message: string;
}>();
</script>

<template>
  <div class="state-card notice" :class="{ 'notice--error': tone === 'error' }">
    <div class="state-logo state-logo--muted">!</div>
    <p>{{ message }}</p>
  </div>
</template>
