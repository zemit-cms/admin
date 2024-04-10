<script setup lang="ts">
import DataTable from "@/components/DataTable.vue";
import {UserService} from "zemit-sdk";
import UserForm from "@/pages/user/UserForm.vue";

const service = new UserService();

const headers = [
  {
    title: 'Action',
    sortable: false,
    fixed: true,
    align: 'end',
    key: '__action__',
  },
  {
    title: 'Email',
    sortable: true,
    searchable: true,
    key: 'email',
  },
  {
    title: 'First Name',
    sortable: true,
    searchable: true,
    key: 'firstName',
  },
  {
    title: 'Last Name',
    sortable: true,
    searchable: true,
    key: 'lastName',
  },
  {
    title: 'Last Name',
    sortable: true,
    searchable: true,
    key: 'lastName',
  },
  {
    title: 'Last Name',
    sortable: true,
    searchable: true,
    key: 'lastName',
  },
  {
    title: 'Last Name',
    sortable: true,
    searchable: true,
    key: 'lastName',
  },
  {
    title: 'Last Name',
    sortable: true,
    searchable: true,
    key: 'lastName',
  },
  {
    title: 'Last Name',
    sortable: true,
    searchable: true,
    key: 'lastName',
  },
  {
    title: 'Last Name',
    sortable: true,
    searchable: true,
    key: 'lastName',
  },
];
</script>

<template>
  <v-container fluid>
    <v-sheet elevation="12">
      <DataTable
        :service="service"
        :form-component="UserForm"
        :headers="headers"
        :data-table-server-props="{
          sticky: true,
          rowProps: (row: any) => {
            // @todo for colors
            return {}
          },
          cellProps: (cell: any) => {
            const props: any = {}
            if (cell.column.value == '__action__') {
              props.class = 'ma-0 pa-0 text-no-wrap'
            }
            return props
          },
        }"
      >
<!--        <template v-slot:expanded-row="{ columns, item }">-->
<!--          <tr>-->
<!--            <td-->
<!--              class="ma-0 pa-0"-->
<!--              :colspan="columns.length"-->
<!--            >-->
<!--              <DataForm-->
<!--                :fields="fields"-->
<!--                :service="service"-->
<!--              >-->
<!--                <template #prepend-card-text="{ data }">-->
<!--                  &lt;!&ndash;          {{data.rolelist[0].data}}&ndash;&gt;-->
<!--                </template>-->
<!--              </DataForm>-->
<!--            </td>-->
<!--          </tr>-->
<!--        </template>-->
      </DataTable>
    </v-sheet>
  </v-container>
</template>


