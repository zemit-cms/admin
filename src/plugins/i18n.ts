import {createI18n, I18nOptions } from 'vue-i18n'
import en from '@/locales/en-US.json';
import fr from '@/locales/fr-CA.json';

const messages: any = {
  en,
  fr,
};

const opts: I18nOptions = {
  legacy: false,
  locale: 'en',
  fallbackLocale: ['en'],
  formatFallbackMessages: true,
  messages,
};

const i18n = createI18n(opts)

export default i18n;
