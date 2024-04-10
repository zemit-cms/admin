<script setup lang="ts">
import {ref} from "vue";
import {v4 as uuidv4} from 'uuid';
import draggable from 'vuedraggable'

const model = defineModel({
  type: Array<any>,
  default: () => ([])
})

export interface Props {
  defaultItem: any,
  addItemLabel: string,
}

const props = withDefaults(defineProps<Props>(), {
  defaultItem: '',
  addItemLabel: ''
})

function onAddItemClick(index?: number) {
  addItem(index)
}

function addItem(index?: number) {
  const start = index? index + 1 : model.value.length
  model.value.splice(start, 0, [props.defaultItem])
}

function onRemoveItemClick(index?: number) {
  removeItem(index)
}

function removeItem(index?: number) {
  const start = index? index : model.value.length
  model.value.splice(start, 1)
}
</script>

<template>
  <draggable
    v-if="model.length"
    v-model="model"
    handle=".sortable-handle"
    item-key="uuid"
    :animation="222"
    :group="{
      name: uuidv4(),
    }"
    :disabled="false"
    ghost-class="ghost"
  >
    <template #item="{element, index}">
      <v-row
        no-gutters
        class="d-flex flex-nowrap"
        :key="index"
      >
        <v-col
          cols="1"
          style="max-width: 28px"
          class="flex-shrink-0 align-self-center"
        >
          <v-icon
            class="sortable-handle cursor-grab"
            icon="mdi-drag"
            @click.prevent
          />
        </v-col>
        <v-col
          cols="10"
          class="flex-grow-1"
          style="width: 100%"
        >
          <slot
            name="default"
            v-bind="{
            model,
            element,
            index
          }"
          >
            {{index}}
          </slot>
        </v-col>
        <v-col
          cols="1"
          class="flex-shrink-0 text-no-wrap align-self-center"
        >
          <slot
            name="item-actions"
            v-bind="{
              model,
              element,
              index
            }"
          >
            <v-btn
              color="success"
              variant="text"
              icon="mdi-plus"
              @click="() => onAddItemClick(index)"
            ></v-btn>
            <v-btn
              color="error"
              variant="text"
              icon="mdi-close"
              @click="() => onRemoveItemClick(index)"
            ></v-btn>
          </slot>
        </v-col>
      </v-row>
    </template>
  </draggable>
  <v-row class="mt-2">
    <v-col cols="12">
      <slot
        name="bottom-actions"
      >
        <v-btn
          block
          variant="outlined"
          prepend-icon="mdi-plus"
          @click="() => onAddItemClick()"
        >
          {{addItemLabel}}
        </v-btn>
      </slot>
    </v-col>
  </v-row>
</template>
