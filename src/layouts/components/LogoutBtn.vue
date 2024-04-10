<script setup lang="ts">
import {ref} from "vue";
import {VBtnProps, VTooltipProps} from "@/types/extract-props";
import {Identity, AuthService, AuthLogoutViewInterface, ResponseInterface} from 'zemit-sdk'
import {toast} from "vuetify-sonner";
import {useRouter} from "vue-router";
import {handleCatch} from "@/composables/forms";
import {useI18n} from "vue-i18n";
import {useConfirm} from "vuetify-use-dialog";

const { t } = useI18n()
const createConfirm = useConfirm()
const service = new AuthService();

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

async function onLogoutClick() {
  const isConfirmed = await createConfirm({
    title: t('confirmation.logout.title'),
    content: t('confirmation.logout.description'),
    dialogProps: {
      width: 500,
    },
  })
  if (isConfirmed) {
    logout()
  }
}

function logout() {
  loading.value = true;
  service.logout()
    .then(response => {
      if (!response.data.view.loggedIn) {
        Identity.removeIdentity()
        router.push({name: 'Login'})
      } else {
        toast.error(t('error.logout.title'), {
          description: t('error.logout.description'),
          prependIcon: 'mdi-emoticon-dead-outline',
        })
      }
    })
    .catch(handleCatch({}, t('error.logout.title')))
    .finally(() => loading.value = false)
}
</script>

<template>
  <v-tooltip
    location="bottom"
    v-bind="tooltipProps"
  >
    <template v-slot:activator="{ props }">
      <v-btn
        v-test-id="'logout-btn'"
        :loading="loading"
        variant="text"
        icon="mdi-logout-variant"
        @click="onLogoutClick"
        v-bind="{...btnProps, ...props}"
      />
    </template>
    <span
      v-text="$t('btn.logout')"
      v-test-id="'logout-tooltip-label'"
    >
    </span>
  </v-tooltip>
</template>
