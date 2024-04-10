import {Rules} from "zemit-sdk";
import i18n from "@/plugins/i18n";

export function useRules() {
  const { t } = i18n.global
  return {
    required: (value: Array<any> | string | null | undefined) => Rules.required(value) || t('validation.failed.required'),
    email: (value: string) => Rules.email(value) || t('validation.failed.email'),
  }
}
