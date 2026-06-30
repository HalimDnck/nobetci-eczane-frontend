<script setup lang="ts">
import type { Language } from '../../i18n';
import { messages } from '../../i18n';
import type { ThemeMode } from '../../types/ui';
import LanguageSelector from '../LanguageSelector.vue';
import ThemeToggle from '../ThemeToggle.vue';

defineProps<{
  language: Language;
  showBack?: boolean;
  showSearch?: boolean;
  subtitle: string;
  theme: ThemeMode;
}>();

const emit = defineEmits<{
  back: [];
  home: [];
  search: [];
  'update:language': [language: Language];
  'update:theme': [theme: ThemeMode];
}>();
</script>

<template>
  <header class="app-header">
    <button
      v-if="showBack"
      class="icon-toggle"
      type="button"
      :aria-label="messages[language].back"
      @click="emit('back')"
    >
      <span aria-hidden="true">&lt;</span>
    </button>

    <button class="brand-button" type="button" @click="emit('home')">
      <span class="brand-mark" aria-hidden="true">+</span>
      <span>
        <strong>{{ messages[language].appName }}</strong>
        <small>{{ subtitle }}</small>
      </span>
    </button>

    <div class="header-controls">
      <button v-if="showSearch" class="search-shortcut" type="button" @click="emit('search')">
        {{ messages[language].searchShortcut }}
      </button>
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
  </header>
</template>
