<script setup lang="ts">
import {ref} from 'vue'
import DataForm from "@/components/DataForm.vue";
import {useRoute} from 'vue-router'
import {TableModel, TableService} from 'zemit-sdk'
import {useRules} from "@/composables/rules";
import DataList from "@/components/DataList.vue";

const route = useRoute('TableForm')

const model = ref(new TableModel())
model.value.Fields = [];

const data = ref({})

const service = new TableService();

const rules = useRules()

const fieldTypes = [
  { title: 'Link to another record', value: 'linkToAnotherRecord' },
  { title: 'Single line text', value: 'singleLineText' },
  { title: 'Long text', value: 'longText' },
  { title: 'Attachment', value: 'attachment' },
  { title: 'Checkbox', value: 'checkbox' },
  { title: 'Multiple select', value: 'multipleSelect' },
  { title: 'Single select', value: 'singleSelect' },
  { title: 'User', value: 'user' },
  { title: 'Date', value: 'date' },
  { title: 'Phone number', value: 'phoneNumber' },
  { title: 'Email', value: 'email' },
  { title: 'URL', value: 'url' },
  { title: 'Number', value: 'number' },
  { title: 'Currency', value: 'currency' },
  { title: 'Percent', value: 'percent' },
  { title: 'Duration', value: 'duration' },
  { title: 'Rating', value: 'rating' },
  { title: 'Formula', value: 'formula' },
  { title: 'Rollup', value: 'rollup' },
  { title: 'Count', value: 'count' },
  { title: 'Lookup', value: 'lookup' },
  { title: 'Created time', value: 'createdTime' },
  { title: 'Last modified time', value: 'lastModifiedTime' },
  { title: 'Created by', value: 'createdBy' },
  { title: 'Last modified by', value: 'lastModifiedBy' },
  { title: 'Autonumber', value: 'autonumber' },
  { title: 'Barcode', value: 'barcode' },
  { title: 'Button', value: 'button' },
];

const fields = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    rules: [
      rules.required,
    ]
  },
]
</script>

<template>
  <v-container fluid>
    <v-sheet elevation="12">
      <DataForm
        v-model="model"
        v-model:data="data"
        title="Table"
        :fields="fields"
        :service="service"
        :default="{workspaceId: parseInt(route.params.wid)}"
      >
        <template #append-fields>
          <v-row>
            <v-col cols="12">
              <v-sheet>
                <DataList
                  v-model="model.Fields"
                  add-item-label="Add new field"
                >
                  <template #default="{index}">
                    <v-row no-gutters>
                      <v-col cols="8">
                        <v-text-field
                          v-model="model.Fields[index].name"
                          variant="outlined"
                          :placeholder="`Field Name (${index+1})`"
                          hide-details
                        />
                      </v-col>
                      <v-col cols="4">
                        <v-select
                          v-model="model.Fields[index].type"
                          :items="fieldTypes"
                          placeholder="Field Type"
                          variant="outlined"
                          hide-details
                        />
                      </v-col>
                    </v-row>
                  </template>
                  <template #expansion="{index}">
                    TEST
                  </template>
                </DataList>
              </v-sheet>
            </v-col>
          </v-row>


        </template>
      </DataForm>
    </v-sheet>
  </v-container>
</template>


