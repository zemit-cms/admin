<script setup lang="ts">
import MdiIcons from '@/assets/mdi-icons.json'

// default model is the icon
const model = defineModel({
  type: String,
  default: 'home'
});
</script>

<template>
  <v-autocomplete
    v-model="model"
    label="Icon"
    :items="MdiIcons"
    :prepend-inner-icon="'mdi-' + (model || 'home')"
    variant="outlined"
    hide-details="auto"
    auto-select-first
    clear-on-select
    clearable
  >
    <template v-slot:item="{ props, item }">
      <v-list-item
        v-bind="props"
        :prepend-icon="'mdi-' + item.value"
        :title="item.title"
      ></v-list-item>
    </template>
  </v-autocomplete>
</template>


