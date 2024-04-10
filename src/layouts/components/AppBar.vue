<script lang="ts" setup>
import WorkspaceSelector from "@/layouts/components/WorkspaceSelector.vue";
import ProfileBtn from "@/layouts/components/ProfileBtn.vue";
import LogoutBtn from "@/layouts/components/LogoutBtn.vue";
</script>

<template>
  <v-app-bar
    elevation="1"
  >
    <v-app-bar-title
      class="mr-2 ml-2 pl-0"
    >
      <WorkspaceSelector/>
    </v-app-bar-title>

    <template v-slot:append>
      <ProfileBtn/>
      <LogoutBtn/>
    </template>
  </v-app-bar>
</template>
