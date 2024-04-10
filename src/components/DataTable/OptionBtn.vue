<script setup lang="ts">
import {computed, mergeProps, onMounted, Ref, ref, watch} from 'vue'
import draggable from 'vuedraggable'
import {VBtnProps, VTooltipProps, ExtractProps, InternalDataTableHeader} from '@/types/extract-props'
import {useCloned} from "@vueuse/core";
import {v4 as uuidv4} from 'uuid';

export interface SelectedFieldInterface {
  title?: string;
  key?: string;
  order?: string,
  display?: boolean
  uuid: string;
}

export interface Props {
  btnProps?: VBtnProps
  tooltipProps?: VTooltipProps
  draggableProps?: ExtractProps<typeof draggable>
  headers?: Array<any>
  variant?: 'default' | 'sort' | 'group' | 'columns'
}

const props = withDefaults(defineProps<Props>(), {
  btnProps: () => ({}),
  tooltipProps: () => ({}),
  draggableProps: () => ({}),
  headers: () => ([]),
  variant: 'default',
})

const model = defineModel({
  type: Array<any>,
  default: () => ([])
})

const variantToIcon = {
  'default': undefined,
  'sort': 'mdi-sort',
  'group': 'mdi-group',
  'columns': 'mdi-eye',
};

const autocomplete = ref(null)
const menu = ref(false)
const tooltip = ref(false)
const drag = ref(false)
const display = ref(true)
const selectedHeaders = ref([])
const selectedFields: Ref<SelectedFieldInterface[]> = ref([])

const modelCount = computed(() => {
  if (props.variant === 'columns') {
    return model.value.filter((field) => field.display).length
  }
  return model.value.length
})

const filteredHeaders = computed(() => {
  return props.headers.filter(filterProtected).filter(filterSortable).filter(filterSelected)
})

const canApply = computed(() => {
  return JSON.stringify(model.value) !== JSON.stringify(selectedFields.value)
})

const canClear = computed(() => {
  return model.value.length || selectedFields.value.length
})

const showClear = computed(() => {
  return props.variant !== 'columns';
})

const showDisplayToggle = computed(() => {
  return !showClear.value
})

onMounted(() => {
  if (props.variant === 'columns') {
    selectFieldChange(props.headers.filter(filterProtected))
  }
})

function onSelectFieldChange(value: InternalDataTableHeader|InternalDataTableHeader[]) {
  selectFieldChange(value)
}

function selectFieldChange(value: InternalDataTableHeader|InternalDataTableHeader[]) {
  if (!Array.isArray(value)) {
    appendSelectedField(value)
  } else {
    value.forEach((item) => {
      appendSelectedField(item);
    })
  }
  selectedHeaders.value = [];
}

function appendSelectedField(value: InternalDataTableHeader) {
  const selectedField: SelectedFieldInterface = {
    title: value.title,
    key: value.key,
    uuid: uuidv4(),
  }
  if (props.variant === 'sort' || props.variant === 'group') {
    selectedField.order = 'asc'
  }
  if (props.variant === 'columns') {
    selectedField.display = true
  }
  selectedField.uuid = uuidv4()
  selectedFields.value.push(selectedField)
}

function getAppendIconByElement(element: SelectedFieldInterface) {
  if (props.variant === 'sort' || props.variant === 'group') {
    return element.order === 'asc'? 'mdi-arrow-down' : 'mdi-arrow-up';
  }
  return undefined
}

function onDisplayToggleClick() {
  displayToggle()
}

function displayToggle() {
  display.value = !display.value
  selectedFields.value.forEach((element) => {
    element.display = display.value;
  })
}

function onElementClick(element : SelectedFieldInterface) {
  if (props.variant === 'sort' || props.variant === 'group') {
    toggleOrder(element)
  }
}

function toggleOrder(element: SelectedFieldInterface) {
  element.order = element.order === 'asc'? 'desc' : 'asc'
}

function onClearClick() {
  clear()
  menu.value = false
}

function onApplyClick() {
  apply()
  menu.value = false
}

function clear() {
  selectedFields.value = []
  apply()
}

function apply() {
  // apply selectedFields to model without ref
  const { cloned } = useCloned(selectedFields)
  model.value = cloned.value
}

function removeItem(item: SelectedFieldInterface) {
  const index = selectedFields.value.findIndex(value => value.key === item.key)
  if (index >= 0) {
    selectedFields.value.splice(index, 1);
  }
}

function filterProtected(_header: InternalDataTableHeader) {
  return true;
  // return header.key !== '__action__'
}

function filterSortable(header: InternalDataTableHeader) {
  return header.sortable
}

function filterSelected(header: InternalDataTableHeader) {
  return selectedFields.value.findIndex(item => header.key === item.key) === -1;
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
              :prepend-icon="variantToIcon[variant]"
              :variant="model.length? 'tonal' : 'text'"
              @click="tooltip = false"
              v-bind="mergeProps(btnProps, _menuProps, _tooltipProps)"
            >
              <slot name="btn-content">
                {{$t('datatable.btn.' + variant + '.title')}}
              </slot>
              <template v-if="modelCount">
                ({{modelCount}})
              </template>
            </v-btn>
          </template>
          <slot name="btn-tooltip">
            <span>
              {{$t('datatable.btn.' + variant + '.tooltip')}}
            </span>
          </slot>
        </v-tooltip>
      </template>

      <v-card min-width="240">
        <v-list>
          <draggable
            v-if="selectedFields.length"
            v-model="selectedFields"
            handle=".sortable-handle"
            :disabled="false"
            :animation="222"
            group="selected-fields"
            ghostClass="ghost"
            @start="drag = true"
            @end="drag = false"
            item-key="uuid"
            v-bind="draggableProps"
          >
            <template #item="{element}">
              <v-list-item>
                <template #prepend>

                </template>
                <template #append>
                  <v-btn
                    v-if="variant !== 'columns'"
                    variant="text"
                    icon="mdi-close"
                    size="small"
                    @click="removeItem(element)"
                  ></v-btn>
                  <v-switch
                    v-else
                    v-model="element.display"
                    inset
                    color="primary"
                    hide-details
                    density="compact"
                  ></v-switch>
                </template>
                <v-list-item-title>
                  <v-icon
                    class="sortable-handle"
                    icon="mdi-drag"
                    @click.prevent
                  />
                  <v-chip
                    class="ml-2"
                    label
                    :append-icon="getAppendIconByElement(element)"
                    @click="onElementClick(element)"
                  >
                    {{element.title}}
                  </v-chip>
                </v-list-item-title>
              </v-list-item>
            </template>
          </draggable>
          <v-list-item v-if="filteredHeaders.length">
            <v-list-item-action>
              <v-autocomplete
                ref="autocomplete"
                v-model="selectedHeaders"
                placeholder="Add a field"
                :items="filteredHeaders"
                hide-details
                item-title="title"
                variant="plain"
                density="compact"
                prepend-inner-icon="mdi-plus"
                multiple
                chips
                return-object
                @click:prepend-inner="() => {}"
                @update:model-value="onSelectFieldChange"
              >
              </v-autocomplete>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-divider class="mx-4"></v-divider>
        <v-card-actions>
          <v-btn
            v-if="showClear"
            variant="flat"
            :disabled="!canClear"
            @click="onClearClick"
          >
            Clear
          </v-btn>
          <v-btn
            v-if="showDisplayToggle"
            variant="flat"
            @click="onDisplayToggleClick"
          >
            <template v-if="display">
              Hide all ({{selectedFields.length}})
            </template>
            <template v-else>
              Show all ({{selectedFields.length}})
            </template>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="primary"
            :disabled="!canApply"
            @click="onApplyClick"
          >
            Apply
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>
