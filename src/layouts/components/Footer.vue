<script setup lang="ts">
const version = JSON.parse(process.env.npm_package_version || '"1.0.0"')
const year = new Date().getFullYear()
</script>

<template>
  <v-footer
    app
    name="footer"
    class="d-block d-md-flex text-center justify-md-space-between justify-center caption"
  >
    <span v-text="$t('footer.copyright', {name: 'Zemit', year})"></span>
    <span v-text="$t('footer.version', {version})"></span>
  </v-footer>
</template>
