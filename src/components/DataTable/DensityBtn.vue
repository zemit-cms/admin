<script setup lang="ts">
import {mergeProps, ref, PropType} from "vue";
import {VBtnProps, VTooltipProps} from "@/types/extract-props";

export type DensityTypeValue = null | 'default' | 'comfortable' | 'compact'
export interface DensityTypeInterface {
  text?: string;
  value: DensityTypeValue;
  icon?: string;
}

export interface Props {
  btnProps?: VBtnProps
  tooltipProps?: VTooltipProps
  densities?: DensityTypeInterface[]
}

const props = withDefaults(defineProps<Props>(), {
  btnProps: () => ({}),
  tooltipProps: () => ({}),
  densities: () => ([
    {
      text: 'Compact',
      value: 'compact',
      icon: 'mdi-format-line-spacing',
    },
    {
      text: 'Comfortable',
      value: 'comfortable',
      icon: 'mdi-format-line-spacing',
    },
    {
      text: 'Default',
      value: 'default',
      icon: 'mdi-format-line-spacing',
    },
  ]),
})

const model = defineModel({
  type: String as PropType<DensityTypeValue>,
  default: 'default'
})

const menu = ref(false)
const tooltip = ref(false)

function onDensityClick(density: DensityTypeInterface) {
  model.value = density.value
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
              prepend-icon="mdi-format-line-spacing"
              :variant="model !== 'default'? 'tonal' : 'text'"
              @click="tooltip = false"
              v-bind="mergeProps(btnProps, _menuProps, _tooltipProps)"
            >
              <slot name="btn-content">
                {{$t('datatable.btn.density.title')}}
              </slot>
            </v-btn>
          </template>
          <slot name="btn-tooltip">
            <span>
              {{$t('datatable.btn.density.tooltip')}}
            </span>
          </slot>
        </v-tooltip>
      </template>

      <v-card min-width="240">
        <v-list>
          <v-list-item
            v-model="model"
            v-for="(density, index) in densities"
            :key="index"
            :value="density.value"
            variant="plain"
            @click="() => onDensityClick(density)"
          >
            <template v-slot:prepend>
              <v-icon :icon="density.icon"></v-icon>
            </template>
            <v-list-item-title>
              {{density.text}}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>
