import {SubmitEventPromise} from "vuetify";
import {toast} from "vuetify-sonner";
import i18n from "@/plugins/i18n";
import {AxiosError} from "axios";
import {DataInterface, fieldsMessages, ResponseInterface} from 'zemit-sdk'
import {MessageInterface} from 'zemit-sdk/dist/types/interfaces'

const { t } = i18n.global

export function handleSubmit(success: CallableFunction) {
  return (event: SubmitEventPromise) => {
    event.then((state) => {
      if (state.valid) {
        success && success()
      } else {
        toast.error(t('validation.failed.form.title'), {
          description: t('validation.failed.form.description')
        })
      }
    })
  }
}

export function handleCatch(
  errors: fieldsMessages<any> = {},
  title = t('error.request.title')
) {
  return (reason: AxiosError<DataInterface<{messages: MessageInterface[]}>>) => {
    const messages = reason?.response?.data?.view?.messages || []
    if (messages.length) {
      const descriptions: string[] = [];
      messages.forEach(message => {
        const fields = Array.isArray(message.field)
          ? message.field
          : [message.field || '_'];
        fields.forEach((field) => (errors[field] = errors[field] ?? []).push(message));
        descriptions.push(message.code + ': ' + message.message + ' (' + fields.join(', ') + ')')
      });
      toast.error(title, {
        description: descriptions.join('\r\n'),
      });
    } else {
      // @todo add status code message from response
      toast.error(title, {
        description: t('error.request.description'),
        prependIcon: 'mdi-emoticon-dead-outline',
      })
    }
  }
}
