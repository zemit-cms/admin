<template>
  <v-form>
    <v-text-field
      name="email"
      label="Email"
      variant="outlined"
    />
  </v-form>
</template>

<script lang="ts">
import { Component, Vue, toNative } from 'vue-facing-decorator'

@Component
class LoginPage extends Vue {
}

export default toNative(LoginPage)
</script>
