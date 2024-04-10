<script lang="ts" setup>
import {useSharedWorkspace} from '@/composables/workspaces'
import {ref} from 'vue'
import WorkspaceForm from '@/pages/workspace/WorkspaceForm.vue'
import {WorkspaceModel} from 'zemit-sdk'

const dialog = ref(false)
const search = ref('')

const model = ref<WorkspaceModel>()
const {workspace, workspaces, loading} = useSharedWorkspace()

function getIcon(workspace?: WorkspaceModel): string {
  return 'mdi-' + (workspace?.icon || 'home')
}

function onNewItemClick() {
  newItem()
}

function newItem() {
  model.value = undefined
  dialog.value = true
}

function onEditItemClick(item: WorkspaceModel) {
  editItem(item)
}

function editItem(item: WorkspaceModel) {
  model.value = item
  dialog.value = true
}
</script>

<template>
  <v-autocomplete
    v-model="workspace"
    v-model:search="search"
    :items="workspaces"
    :prepend-inner-icon="getIcon(workspace)"
    :label="!workspace? 'Workspace' : ''"
    placeholder="Select Your Workspace"
    variant="solo-filled"
    item-title="name"
    item-value="uuid"
    auto-select-first
    hide-selected
    hide-details
    return-object
    clearable
  >
    <template #no-data></template>
    <template #prepend-item>
      <v-list-item
        prepend-icon="mdi-plus"
        title="Create a new workspace"
        subtitle="Click to start a fresh workspace"
        @click="onNewItemClick"
      >
      </v-list-item>
    </template>
    <template #item="{props, item}">
      <v-list-item
        v-bind="props"
        :prepend-icon="getIcon(item.raw)"
        :title="item.raw.name"
        :subtitle="item.raw.description"
      >
        <template #append>
          <v-icon
            icon="mdi-pencil"
            @click.prevent="() => onEditItemClick(item.raw)"
          />
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>

  <v-dialog
    v-model="dialog"
    persistent
    width="1160"
  >
    <WorkspaceForm
      v-model="model"
      v-model:dialog="dialog"
    />
  </v-dialog>
</template>
