<script setup lang="ts">
import {mergeProps, ref} from 'vue'

// default model is the color
const model = defineModel({
  type: String,
  default: ''
});

// menu toggle model
const menu = defineModel('menu', {
  type: Boolean,
  default: false
});

// advanced color picker toggle model
const advanced = defineModel('advanced', {
  type: Boolean,
  default: false
});

function closeMenu() {
  menu.value = false;
}

function onClearClick() {
  clear()
  closeMenu()
}

function clear() {
  model.value = '';
}

function onToggleAdvancedClick() {
  toggleAdvanced()
}

function toggleAdvanced() {
  advanced.value = !advanced.value;
}

function onApplyclick() {
  closeMenu()
}

function apply() {
  menu.value = false
}

</script>

<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    close-on-back
    location="bottom"
  >
    <template v-slot:activator="{ props: _menuProps }">
      <v-text-field
        v-model="model"
        hide-details="auto"
        label="Color"
        variant="outlined"
        clearable
        :append-inner-icon="menu? 'mdi-menu-up' : 'mdi-menu-down'"
        @click:append-inner.prevent="advanced = true"
        v-bind="mergeProps(_menuProps)"
      >
        <template #prepend-inner>
          <v-icon :color="model">mdi-circle</v-icon>
        </template>
      </v-text-field>
    </template>
    <v-card>
      <v-color-picker
        v-model="model"
        elevation="0"
        border
        width="100%"
        swatches-max-height="300"
        hide-inputs
        :hide-canvas="!advanced"
        :hide-sliders="!advanced"
        show-swatches
      ></v-color-picker>
      <v-card-actions>
        <v-btn
          @click="onClearClick"
        >
          Clear
        </v-btn>
        <v-spacer/>
        <v-btn
          @click="onToggleAdvancedClick"
        >
          {{advanced? 'Hide Advanced Picker' : 'Show Advanced Picker'}}
        </v-btn>
        <v-btn
          variant="tonal"
          color="primary"
          @click="onApplyclick"
        >
          Apply
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>


