<script setup lang="ts">
import type { Language } from '../../i18n';
import { messages } from '../../i18n';
import type { ThemeMode } from '../../types/ui';
import LanguageSelector from '../LanguageSelector.vue';
import ThemeToggle from '../ThemeToggle.vue';

defineProps<{
  isLoading: boolean;
  language: Language;
  theme: ThemeMode;
}>();

const emit = defineEmits<{
  allow: [];
  deny: [];
  'update:language': [language: Language];
  'update:theme': [theme: ThemeMode];
}>();
</script>

<template>
  <section class="permission-screen">
    <div class="permission-controls">
      <LanguageSelector
        :model-value="language"
        @update:model-value="emit('update:language', $event)"
      />
      <ThemeToggle
        :model-value="theme"
        :language="language"
        @update:model-value="emit('update:theme', $event)"
      />
    </div>

    <div class="permission-content">
      <div class="state-logo">E</div>
      <h1>{{ messages[language].permissionTitle }}</h1>
      <p>{{ messages[language].permissionDescription }}</p>

      <div class="permission-illustration" aria-hidden="true">
        <div class="permission-radar">
          <span />
        </div>
        <div class="permission-mini-list">
          <span>Merkez <strong>850 m</strong></span>
          <span>Sifa <strong>1.2 km</strong></span>
          <span>Hayat <strong>2.1 km</strong></span>
        </div>
      </div>

      <small>{{ messages[language].permissionPrivacy }}</small>
      <button
        class="button button--primary permission-primary"
        type="button"
        :disabled="isLoading"
        @click="emit('allow')"
      >
        {{ isLoading ? messages[language].locating : messages[language].useLocation }}
      </button>
      <button class="link-button" type="button" @click="emit('deny')">
        {{ messages[language].continueWithoutLocation }}
      </button>
    </div>
  </section>
</template>
