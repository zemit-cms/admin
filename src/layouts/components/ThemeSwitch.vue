<script setup lang="ts">
import {useTheme} from 'vuetify'
import {computed} from "vue";
import {VBtnProps, VTooltipProps} from "@/types/extract-props";

export interface Props {
  btnProps?: VBtnProps
  tooltipProps?: VTooltipProps
}
withDefaults(defineProps<Props>(), {
  btnProps: () => ({}),
  tooltipProps: () => ({})
})

const theme = useTheme();
const isDark = computed(() => theme.current.value.dark)

function onSwitchThemeClick(): void {
  switchTheme()
}

function switchTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
  // store.local.set('theme', this.theme.global.name.value)
}
</script>

<template>
  <!-- DARK MODE -->
  <v-tooltip
    location="bottom"
    v-bind="tooltipProps"
  >
    <template v-slot:activator="{ props }">
      <v-btn
        v-test-id="'app-theme-toggle-button'"
        variant="text"
        icon="mdi-theme-light-dark"
        @click="onSwitchThemeClick"
        v-bind="{...btnProps, ...props}"
      />
    </template>
    <span v-test-id="'app-theme-toggle-tooltip'">
      <template v-if="isDark">Switch to light mode</template>
      <template v-else>Switch to dark mode</template>
    </span>
  </v-tooltip>
</template>
