<script lang="ts" setup>
import AppBar from '@/layouts/components/AppBar.vue'
import NavigationDrawer from "@/layouts/components/NavigationDrawer.vue";
import Main from '@/layouts/components/Main.vue'
import Footer from '@/layouts/components/Footer.vue'
import Sonner from "@/layouts/components/Sonner.vue";
</script>

<template>
  <v-app>
    <AppBar />
    <NavigationDrawer />
    <Main />
    <Footer />
    <Sonner position="top-right" />
  </v-app>
</template>
