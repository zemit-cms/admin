<script setup lang="ts">
import {WorkspaceService} from 'zemit-sdk'
import DataTable from "@/components/DataTable.vue";
import WorkspaceForm from "@/pages/workspace/WorkspaceForm.vue";

const service = new WorkspaceService();

const headers = [
  {
    title: 'Action',
    sortable: false,
    fixed: true,
    align: 'end',
    key: '__action__',
  },
  {
    title: 'Workspace',
    sortable: true,
    searchable: true,
    key: 'name',
  },
  {
    title: 'Description',
    sortable: true,
    searchable: true,
    key: 'description',
  },
];
</script>

<template>
  <v-container fluid>
    <v-sheet elevation="12">
      <DataTable
        :service="service"
        :form-component="WorkspaceForm"
        :headers="headers"
      >
      </DataTable>
    </v-sheet>
  </v-container>
</template>


