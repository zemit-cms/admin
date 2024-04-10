import vuetify from './vuetify'
import pinia from '../store'
import router from '../router'
import i18n from "@/plugins/i18n";
import vuetifyUseDialog from "@/plugins/vuetify-use-dialog";
import hljsVuePlugin from "@/plugins/highlightjs";

import type { App } from 'vue'

export function registerPlugins (app: App) {
  app
    .use(i18n)
    .use(router)
    .use(pinia)
    .use(vuetify)
    .use(vuetifyUseDialog)
    .use(hljsVuePlugin)
}
