<script setup lang="ts">
import {VBtnProps, VTooltipProps, VMenuProps} from "@/types/extract-props";
import {useLocale} from "vuetify";
import {useI18n} from "vue-i18n";
import {mergeProps, ref} from "vue";

const {current: vuetifyLocale} = useLocale()
const {locale, availableLocales} = useI18n()

const show = ref(false);

export interface Props {
  btnProps?: VBtnProps
  tooltipProps?: VTooltipProps
  menuProps?: VMenuProps
}

withDefaults(defineProps<Props>(), {
  btnProps: () => ({}),
  tooltipProps: () => ({}),
  menuProps: () => ({}),
})

function changeLocale(value: string) {
  locale.value = value
  vuetifyLocale.value = value
}
</script>

<template>
  <v-menu
    v-if="$i18n.availableLocales && $i18n.availableLocales"
    v-bind="menuProps"
  >
    <template v-slot:activator="{ props: menu }">
      <v-tooltip
        location="top"
        v-model="show"
        v-bind="tooltipProps"
      >
        <template v-slot:activator="{ props: tooltip }">
          <v-btn
            v-test-id="'locale-switcher-btn'"
            variant="text"
            icon="mdi-translate"
            v-bind="mergeProps(btnProps, menu, tooltip)"
            @click="show = false"
          >
            {{locale.toLocaleUpperCase()}}
          </v-btn>
        </template>
        <span v-test-id="'locale-switcher-tooltip-label'">
          Change Language
        </span>
      </v-tooltip>
    </template>
    <v-list>
      <v-list-item
        v-for="(value, index) in availableLocales"
        :key="index"
        :value="value"
        append-avatar=""
        @click="changeLocale(value)"
      >
        <v-list-item-title>{{ value.toLocaleUpperCase() }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

</template>
