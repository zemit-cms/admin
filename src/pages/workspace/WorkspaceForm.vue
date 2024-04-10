<script setup lang="ts">
import AutocompleteIcon from '@/components/AutocompleteIcon.vue'
import TextFieldColorPicker from '@/components/TextFieldColorPicker.vue'
import {computed, ref} from 'vue'
import DataForm from "@/components/DataForm.vue";
import {WorkspaceModel, WorkspaceService} from 'zemit-sdk'
import {useRules} from "@/composables/rules";

const model = defineModel<WorkspaceModel>({
  default: () => (new WorkspaceModel())
})

const dialog = defineModel<Boolean>('dialog', {
  default: () => false,
});

const service = new WorkspaceService()
const rules = useRules()

const data = ref<any>({})

const fields = computed(() => [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    rules: [
      rules.required
    ],
  },
  {
    key: 'description',
    label: 'Description',
    type: 'text',
  },
])
</script>

<template>
  <v-container fluid>
    <v-sheet elevation="12">
      <DataForm
        v-model="model"
        v-model:dialog="dialog"
        v-model:data="data"
        title="Workspace"
        :fields="fields"
        :service="service"
        :default="{icon: 'home'}"
      >
        <template #append-fields>
          <v-row>
            <v-col cols="12">
              <AutocompleteIcon
                v-model="data.icon"
              />
            </v-col>
            <v-col cols="12">
              <TextFieldColorPicker
                v-model="data.color"
              />
            </v-col>
          </v-row>
        </template>
      </DataForm>
    </v-sheet>
  </v-container>
</template>


