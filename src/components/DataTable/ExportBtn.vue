<script setup lang="ts">
import {mergeProps, ref} from "vue";
import {VBtnProps, VTooltipProps} from "@/types/extract-props";

export type ExportTypeValue = 'csv' | 'json' | 'xlsx' | 'xml'
export interface ExportTypeInterface {
  text?: string;
  value: ExportTypeValue | string;
  icon?: string;
}

export interface Props {
  btnProps?: VBtnProps
  tooltipProps?: VTooltipProps
  formats?: ExportTypeInterface[]
}

const props = withDefaults(defineProps<Props>(), {
  btnProps: () => ({}),
  tooltipProps: () => ({}),
  formats: () => ([
    {
      text: 'CSV',
      value: 'csv',
      icon: 'mdi-file-delimited-outline',
    },
    {
      text: 'JSON',
      value: 'json',
      icon: 'mdi-code-json',
    },
    {
      text: 'Excel',
      value: 'xlsx',
      icon: 'mdi-microsoft-excel',
    },
    {
      text: 'XML',
      value: 'xml',
      icon: 'mdi-xml',
    },
  ]),
})

const menu = ref(false)
const tooltip = ref(false)

const model = defineModel({
  type: String,
  default: null,
})

function onExportClick(element: ExportTypeInterface) {
  model.value = element.value
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
              prepend-icon="mdi-file-export-outline"
              :variant="model? 'tonal' : 'text'"
              @click="tooltip = false"
              v-bind="mergeProps(btnProps, _menuProps, _tooltipProps)"
            >
              <slot name="btn-content">
                {{$t('datatable.btn.export.title')}}
              </slot>
            </v-btn>
          </template>
          <slot name="btn-tooltip">
            <span>
              {{$t('datatable.btn.export.tooltip')}}
            </span>
          </slot>
        </v-tooltip>
      </template>

      <v-card min-width="140">
        <v-list>
          <v-list-item
            v-model="model"
            v-for="(element, index) in formats"
            :key="index"
            :value="element.value"
            variant="text"
            @click="() => onExportClick(element)"
          >
            <template v-slot:prepend>
              <v-icon :icon="element.icon"></v-icon>
            </template>
            <v-list-item-title>
              {{element.text}}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>
