<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'

const route = useRoute('Error');

const type = ref('notFound')
const typeList = [
  'unknown',
  'notFound',
  'unauthorized',
  'forbidden',
  'fatal',
]

onMounted(() => {
  const paramType = route.params.type;
  type.value = typeList.includes(paramType) ? paramType : 'notFound';
})

</script>

<template>
  <v-sheet
    color="transparent"
    class="d-flex flex-column align-center justify-center text-center fill-height"
    style="max-width: 25rem; margin: 0 auto"
  >
    <v-icon style="font-size: 120px;">
      mdi-robot-confused-outline
    </v-icon>
    <h1 class="display-3">
      {{$t('page.error.' + type + '.title')}}
    </h1>
    <p class="grey--text lighten-5 mt-2">
      {{$t('page.error.' + type + '.description')}}
    </p>
    <div class="paragraph-text mt-4">
      <v-btn
        v-test-id="'home-page-link'"
        variant="text"
        color="primary"
        prepend-icon="mdi-home"
        :to="{name: 'Home'}"
      >
        <span>Home page</span>
      </v-btn>
    </div>
  </v-sheet>
</template>

<style>
.paragraph-text {
  font-size: 18px;
}
</style>
