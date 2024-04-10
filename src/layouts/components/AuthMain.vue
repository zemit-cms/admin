<script setup lang="ts">
import {computed} from 'vue'
import {useDisplay, useTheme} from 'vuetify'
import LocaleSwitch from "@/layouts/components/LocaleSwitch.vue";
import ThemeSwitch from "@/layouts/components/ThemeSwitch.vue";

const display = useDisplay();
const theme = useTheme();

const maxWidth = computed(() => display.smAndUp ? 350 : undefined)
</script>

<template>
  <v-main class="d-flex align-center justify-center" style="min-height: 100vh;">

    <v-card
      variant="flat"
      elevation="15"
      class="w-100 ma-5 overflow-visible"
      :max-width="maxWidth"
    >
      <LocaleSwitch
        :menu-props="{
          location: 'top',
        }"
        :tooltip-props="{
          location: 'top',
        }"
        :btn-props="{
          style: 'position: absolute; left: 0;',
          class: 'ml-4 mt-3',
        }"
      />

      <!-- THEME TOGGLE -->
      <ThemeSwitch
        :tooltip-props="{
          location: 'top',
        }"
        :btn-props="{
          style: 'position: absolute; right: 0;',
          class: 'mr-4 mt-3',
        }"
      />

      <v-card-text class="d-flex flex-column align-center">
        <v-btn
          style="position: relative; width: 127px; height: 127px; transform: translateY(-85px); margin-bottom: -85px"
          variant="elevated"
          color="default"
          icon
          size="x-large"
        >
          <img
            src="@/assets/logo.png"
            style="bottom: 0; width: 120px; height: 120px;"
            :style="theme.current.value.dark ? 'filter: invert(1)' : null"
          />
        </v-btn>
      </v-card-text>

      <v-card-text>

        <!-- PAGES -->
        <router-view/>

      </v-card-text>

    </v-card>

  </v-main>
</template>
