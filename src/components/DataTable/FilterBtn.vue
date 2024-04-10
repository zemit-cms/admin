<script setup lang="ts">
import {mergeProps, onMounted, Ref, ref} from 'vue'
import {VBtnProps, VTooltipProps} from "@/types/extract-props";
import FilterConditions from "@/components/DataTable/FilterConditions.vue";
import {useCloned} from "@vueuse/core";
import FilterPreview from "@/components/DataTable/FilterPreview.vue";
import {handleSubmit} from "@/composables/forms";

export interface Props {
  btnProps?: VBtnProps
  tooltipProps?: VTooltipProps
  densities?: Array<{text?: string, value: string, icon?: string}>
  headers?: Array<any>
  operators?: Array<{value: string, title: string}>
}

const props = withDefaults(defineProps<Props>(), {
  btnProps: () => ({}),
  tooltipProps: () => ({}),
  headers: () => ([]),
  operators: () => ([
    { value: 'contains', title: 'Contains' },
    { value: 'does not contain', title: 'Does not contain' },
    { value: 'contains word', title: 'Contains word' },
    { value: 'does not contain word', title: 'Does not contain word' },
    { value: 'equals', title: 'Equals' },
    { value: 'does not equal', title: 'Does not equal' },
    { value: 'greater than', title: 'Greater than' },
    { value: 'greater than or equal', title: 'Greater than or equal' },
    { value: 'less than', title: 'Less than' },
    { value: 'less than or equal', title: 'Less than or equal' },
    { value: 'is empty', title: 'Is empty' },
    { value: 'is not empty', title: 'Is not empty' },
    { value: 'regexp', title: 'Matches regular expression' },
    { value: 'not regexp', title: 'Does not match regular expression' },
  ])
})

const filterConditions = ref<InstanceType<typeof FilterConditions> | null>(null)
const valid = ref(false)
const menu = ref(false)
const tooltip = ref(false)
const density = ref<'default'|'compact'|'comfortable'>('compact')
const conditions = ref([[]])
const mode = ref('edit')

const model = defineModel({
  type: Array<any>,
  default: () => ([])
})

const onSubmit = handleSubmit(submit)
function submit() {
  const { cloned } = useCloned(conditions)
  model.value = cloned.value
  menu.value = false
}

function onAddConditionClick(index?: number) {
  addCondition(index)
}

function addCondition(index?: number) {
  filterConditions.value?.addCondition(index)
}

function onPreviewToggleClick() {
  previewToggle()
}

function previewToggle() {
  mode.value = mode.value === 'preview'? 'edit' : 'preview'
}

function onClearClick() {
  clear()
}

function clear() {
  conditions.value[0] = [];
  addCondition(0)
}
</script>

<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      location="bottom"
    >
      <template v-slot:activator="{ props: _menuProps }">
        <v-tooltip
          v-model="tooltip"
          location="top"
          v-bind="tooltipProps"
        >
          <template v-slot:activator="{ props: _tooltipProps }">
            <v-btn
              class="mr-2"
              prepend-icon="mdi-filter"
              :variant="model? 'tonal' : 'text'"
              @click="tooltip = false"
              v-bind="mergeProps(btnProps, _menuProps, _tooltipProps)"
            >
              <slot name="btn-content">
                {{$t('datatable.btn.filter.title')}}
              </slot>
            </v-btn>
          </template>
          <slot name="btn-tooltip">
            <span>
              {{$t('datatable.btn.filter.tooltip')}}
            </span>
          </slot>
        </v-tooltip>
      </template>

      <v-form
        v-model="valid"
        @submit.prevent="onSubmit"
      >
        <v-card min-width="800">
          <v-card-text
            v-if="mode === 'preview'"
          >
            <FilterPreview
              :conditions="conditions[0]"
            />
          </v-card-text>
          <FilterConditions
            v-else
            ref="filterConditions"
            v-model="conditions"
            :headers="headers"
            :density="density"
          />
          <v-card-actions>
            <v-btn
              variant="flat"
              @click="onClearClick"
            >
              Clear
            </v-btn>
            <v-spacer/>
            <v-btn
              color="default"
              prepend-icon="mdi-plus"
              variant="text"
              @click="() => onAddConditionClick(conditions[0].length)"
            >
              Add Condition
            </v-btn>
            <v-btn
              color="default"
              prepend-icon="mdi-plus"
              variant="text"
              @click="() => onAddConditionClick()"
            >
              Add Group
            </v-btn>
            <v-btn
              color="default"
              variant="text"
              :prepend-icon="mode === 'edit'? 'mdi-eye-outline' : 'mdi-lead-pencil'"
              :disabled="!valid"
              @click="() => onPreviewToggleClick()"
            >
              <template v-if="mode === 'edit'">
                Preview
              </template>
              <template v-else>
                Edit
              </template>
            </v-btn>
            <v-btn
              type="submit"
              color="primary"
              variant="flat"
              :disabled="valid === false"
            >
              Apply
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-menu>
  </div>
</template>
