<script setup lang="ts">
import {ref} from "vue";
import {VBtnProps, VTooltipProps} from "@/types/extract-props";
import {useRouter} from "vue-router";
import {useI18n} from "vue-i18n";

const { t } = useI18n()

export interface Props {
  btnProps?: VBtnProps
  tooltipProps?: VTooltipProps
}
withDefaults(defineProps<Props>(), {
  btnProps: () => ({}),
  tooltipProps: () => ({})
})

const router = useRouter();
const loading = ref(false)

function onProfileClick(): void {
  openProfile()
}

function openProfile() {

}
</script>

<template>
  <v-tooltip
    location="bottom"
    v-bind="tooltipProps"
  >
    <template v-slot:activator="{ props }">
      <v-btn
        v-test-id="'profile-btn'"
        :loading="loading"
        variant="text"
        icon="mdi-account-circle"
        @click="onProfileClick"
        v-bind="{...btnProps, ...props}"
      />
    </template>
    <span
      v-text="$t('btn.profile')"
      v-test-id="'profile-tooltip-label'"
    >
    </span>
  </v-tooltip>
</template>
