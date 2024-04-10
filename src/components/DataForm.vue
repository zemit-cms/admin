<script setup lang="ts">
import 'reflect-metadata'
import {plainToClassFromExist} from 'class-transformer'
import {VFormProps} from '@/types/extract-props'
import {Service, Model, AbstractService, fieldsMessages, ModelInterface} from 'zemit-sdk'
import {computed, onMounted, reactive, ref} from 'vue'
import {handleCatch, handleSubmit} from '@/composables/forms'
import {toast} from 'vuetify-sonner'
import {useI18n} from 'vue-i18n'
import {useCloned} from '@vueuse/core'

const {t} = useI18n()

const model = defineModel<ModelInterface>({
  default: () => (new Model),
})

const dialog = defineModel<Boolean>('dialog', {
  default: () => false,
})

const data = defineModel('data', {
  type: Object,
  default: () => ({}),
})

export interface Props
{
  formProps?: Partial<VFormProps>
  title?: string
  fields?: Array<any>
  service: Service | AbstractService
  id?: number
  default?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  dataTableServerProps: () => ({}),
  service: () => (new Service()),
  default: () => ({}),
})

const isNew = ref(false)
const saving = ref(false)
const valid = ref(null)
const form = ref(null)
const original = ref({})
const errors = ref<fieldsMessages<any>>({})
const relations = reactive<{ [key: string]: Array<Model> }>({})
const saveMenu = ref(false)

const canSubmit = computed(() => {
  // return model.isDifferentFromOriginal()
  return JSON.stringify(data.value) !== JSON.stringify(original.value)
})

const onSubmit = handleSubmit(submit)

function submit() {
  saving.value = true
  props.service.save(data.value)
    .then((response: any) => {
      const view = response.data.view
      if (view.saved) {
        toast.success(t('form.success.save.title'), {
          description: t('form.success.save.description'),
        })
        isNew.value = false
        if (view.data) {
          Object.assign(model.value, view.data)
          setData(model)
        }
      }
      else {
        toast.error(t('error.form.title'), {
          description: t('error.form.description'),
          prependIcon: 'mdi-emoticon-dead-outline',
        })
      }
    })
    .catch(handleCatch(errors.value))
    .finally(() => saving.value = false)
}

function loadRelations(fields = props.fields) {
  fields?.forEach((field) => {
    if (field.service) {
      relations[field.key] = []
      field.service.find()
        .then((response: any) => {
          if (response.data.view.data) {
            relations[field.key] = response.data.view.data
          }
        })
    }
  })
}

function load(params = {}) {
  props.service.findFirst(params)
    .then((response: any) => {
      if (response.data.view.data) {
        model.value = response.data.view.data
        setData(model)
      }
    })
    .catch(handleCatch(errors.value, t('error.load.title')))
    .finally(() => saving.value = false)
}

function syncData(object = model) {
  // const nestedProp = useNestedProp(object)
  // props.fields?.forEach((field) => {
  //   nestedProp.set(field.key, data.value[field.key])
  // })
  Object.assign(object, data.value)
}

function setData(object = model) {
  const {cloned: clonedObject} = useCloned(object)
  data.value = clonedObject.value
  // data.value = {}
  //
  // // set form data from fields
  // const nestedProp = useNestedProp(object)
  // props.fields?.forEach((field) => {
  //   data.value[field.key] = nestedProp.get(field.key) || ''
  // })

  // store original form data value
  const {cloned} = useCloned(data)
  original.value = cloned.value
}

function onCreateAndNewClick() {
  createAndNew()
}

function createAndNew() {
  // @todo
}

onMounted(() => {
  if (props.id) {
    load({id: props.id})
  }
  else {
    if (!model.value) {
      model.value = plainToClassFromExist(model.value, props.default)
      isNew.value = true
    }
    setData(model)
  }
  loadRelations()
})
</script>

<template>
  <v-form
    ref="form"
    v-if="model"
    v-model="valid"
    v-bind="formProps"
    @submit.prevent="onSubmit"
  >
    <v-card>
      <template #title>
        <slot name="title">
          <v-card-title>
            {{ title }}
          </v-card-title>
        </slot>
      </template>

      <template #append>
        <slot name="append">
          <v-btn
            v-if="dialog"
            size="small"
            variant="text"
            icon="mdi-close"
            @click="dialog = false"
          ></v-btn>
        </slot>
      </template>

      <v-divider/>

      <v-card-text>
        <slot
          name="prepend-fields"
        ></slot>
        <slot
          name="fields"
        >
          <v-row>
            <v-col
              v-for="(field, fieldIndex) in fields"
              :key="fieldIndex"
              cols="12"
              v-bind="field.colProps"
            >
              <v-text-field
                v-if="field.type === 'text' || field.type === 'password'"
                v-model="data[field.key]"
                :type="field.type"
                :label="field.label"
                :rules="field.rules"
                hide-details="auto"
                variant="outlined"
                v-bind="field.props"
              >
              </v-text-field>
              <v-autocomplete
                v-else-if="field.type === 'relations' || field.type === 'relation'"
                v-model="data[field.key]"
                :items="relations[field.key]"
                item-title="label"
                item-value="id"
                :label="field.label"
                :rules="field.rules"
                hide-details="auto"
                variant="outlined"
                chips
                closable-chips
                :multiple="field.type === 'relations'"
                return-object
                v-bind="field.props"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </slot>
        <slot
          name="append-fields"
        ></slot>
      </v-card-text>

      <v-divider/>
      <v-card-actions>
        <v-btn
          v-if="!isNew"
          color="error"
          variant="text"
          :disabled="isNew"
        >
          {{ $t('form.action.delete.label') }}
        </v-btn>
        <v-btn
          v-if="!isNew"
          type="reset"
          variant="text"
        >
          {{ $t('form.action.reset.label') }}
        </v-btn>
        <v-spacer/>

        <!--        <v-menu-->
        <!--          v-model="saveMenu"-->
        <!--          location="bottom"-->
        <!--        >-->
        <!--          <template v-slot:activator="{ props }">-->
        <!--            <v-btn-->
        <!--              icon="mdi-dots-horizontal"-->
        <!--              :disabled="!canSubmit"-->
        <!--              v-bind="props"-->
        <!--            >-->
        <!--            </v-btn>-->
        <!--          </template>-->

        <!--          <v-list>-->
        <!--            <v-list-item-->
        <!--              v-if="isNew"-->
        <!--              color="primary"-->
        <!--              :disabled="!canSubmit"-->
        <!--              @click="onCreateAndNewClick"-->
        <!--            >-->
        <!--              <v-list-item-title>-->
        <!--                {{$t(`form.action.createAndNew.label`)}}-->
        <!--              </v-list-item-title>-->
        <!--            </v-list-item>-->
        <!--            <v-list-item-->
        <!--              v-if="!isNew"-->
        <!--              color="primary"-->
        <!--              :disabled="!canSubmit"-->
        <!--              @click="onCreateAndNewClick"-->
        <!--            >-->
        <!--              <v-list-item-title>-->
        <!--                {{$t(`form.action..label`)}}-->
        <!--              </v-list-item-title>-->
        <!--            </v-list-item>-->
        <!--          </v-list>-->
        <!--        </v-menu>-->

        <v-btn
          type="submit"
          color="primary"
          variant="tonal"
          :disabled="!canSubmit"
          v-bind="props"
          @click.right.prevent="saveMenu = true"
        >
          {{ $t(`form.action.${isNew ? 'create' : 'save'}.label`) }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>

</template>
