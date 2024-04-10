<template>
  <v-app>
    <router-view/>
  </v-app>
</template>

<script lang="ts">
import {Component, Vue, toNative} from 'vue-facing-decorator'

@Component
class Auth extends Vue {

}

export default toNative(Auth)
</script>
