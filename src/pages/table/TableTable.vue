<script setup lang="ts">
import DataTable from "@/components/DataTable.vue";
import {TableService} from "zemit-sdk";
import TableForm from "@/pages/table/TableForm.vue";

const service = new TableService();

const headers = [
  {
    title: 'Action',
    sortable: false,
    fixed: true,
    align: 'end',
    key: '__action__',
  },
  {
    title: 'Table Name',
    sortable: true,
    searchable: true,
    key: 'label',
  },
  {
    title: 'UUID',
    sortable: true,
    searchable: true,
    key: 'uuid',
  },
];
</script>

<template>
  <v-container fluid>
    <v-sheet elevation="12">
      <DataTable
        :service="service"
        :form-component="TableForm"
        :headers="headers"
        :data-table-server-props="{
        }"
      >
      </DataTable>
    </v-sheet>
  </v-container>
</template>


