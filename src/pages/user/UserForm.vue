<script setup lang="ts">
import DataForm from "@/components/DataForm.vue";
import {RoleService, UserService} from "zemit-sdk";
import {useRules} from "@/composables/rules";

const service = new UserService();
const rules = useRules()

const fields = [
  {
    key: 'firstName',
    label: 'First Name',
    type: 'text',
    colProps: {
      cols: 12,
      md: 6,
    },
  },
  {
    key: 'lastName',
    label: 'Last Name',
    type: 'text',
    props: {
      prependInnerIcon: 'mdi-account',
    },
    colProps: {
      cols: 12,
      md: 6,
    },
  },
  {
    key: 'email',
    label: 'Email',
    type: 'text',
    props: {
      prependInnerIcon: 'mdi-email',
    },
    rules: [
      rules.required,
      rules.email,
    ],
  },
  {
    key: 'rolelist',
    label: 'Roles',
    type: 'relations',
    props: {
      prependInnerIcon: 'mdi-account',
    },
    service: new RoleService()
  },
  {
    key: 'newPassword',
    label: 'Password',
    type: 'password',
    colProps: {
      cols: 6,
    },
  },
  {
    key: 'passwordConfirm',
    label: 'Confirm Password',
    type: 'password',
    colProps: {
      cols: 6,
    },
  },
]
</script>

<template>
  <v-container fluid>
    <v-sheet elevation="12">
      <DataForm
        title="User"
        :fields="fields"
        :service="service"
      >
      </DataForm>
    </v-sheet>
  </v-container>
</template>


