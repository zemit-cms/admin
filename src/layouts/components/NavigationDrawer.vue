<script lang="ts" setup>
import {computed, inject, Ref, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {Identity} from 'zemit-sdk'

const {t} = useI18n()

const input = ref<HTMLInputElement | null>(null)
const search = ref(null)
const expand = ref(true)

const dev = Identity.hasRole(['dev'])
const admin = Identity.hasRole(['admin'])

const workspace = inject<Ref<number | undefined>>('workspace', () => ref(), true)

const navigation = computed(() => {
  return [
    // Tables
    {
      show: workspace.value && (dev || admin),
      title: t('navigation.table.title'),
      children: [
        {
          title: t('navigation.table.title'),
          to: {name: 'TableNew', params: {wid: workspace.value}},
          prependIcon: 'mdi-table-large',
          appendIcon: 'mdi-plus',
          show: dev || admin,
        },
      ],
    },
    // Managements
    {
      show: dev || admin,
      title: t('navigation.management.title'),
      children: [
        {title: t('navigation.user.title'), to: {name: 'User'}, prependIcon: 'mdi-account-outline', show: dev || admin},
        {
          title: t('navigation.role.title'),
          to: {name: 'Home'},
          prependIcon: 'mdi-briefcase-account-outline',
          show: dev,
        },

        {
          title: t('navigation.log.title'),
          to: {name: 'Home'},
          prependIcon: 'mdi-clipboard-text-clock-outline',
          show: dev || admin,
        },
        {
          title: t('navigation.notification.title'),
          to: {name: 'Home'},
          prependIcon: 'mdi-bell-outline',
          show: dev || admin,
        },
        {
          title: t('navigation.task.title'),
          to: {name: 'Home'},
          prependIcon: 'mdi-checkbox-marked-circle-auto-outline',
          show: dev || admin,
        },
        {
          title: t('navigation.template.title'),
          to: {name: 'Home'},
          prependIcon: 'mdi-clipboard-text',
          show: dev || admin,
        },
        {
          title: t('navigation.backup.title'),
          to: {name: 'Home'},
          prependIcon: 'mdi-backup-restore',
          show: dev || admin,
        },
      ],
    },
  ].filter(filterShow).map(mapChildren).filter(filterEmptyGroup).filter(filterTables)
})

function mapChildren(item: any) {
  item.children = item.children ? item.children.filter(filterShow).filter(filterSearch) : []
  return item
}

function filterShow(child: any) {
  return !!child.show
}

function filterEmptyGroup(item: any) {
  return (!item.children || item.children.length)
}

function filterTables(item: any) {
  return true
}

function filterSearch(item: any) {
  if (!search.value) {
    return true
  }
  if (item.title.indexOf(search.value) !== -1) {
    return true
  }
  try {
    const regex = new RegExp(search.value, 'i')
    return regex.test(item.title)
  }
  catch (e) {
    return false
  }
}

function onSearchClick() {
  focusSearchInput()
}

function focusSearchInput() {
  input.value?.focus()
}
</script>

<template>
  <v-navigation-drawer
    v-model="expand"
    expand-on-hover
    rail
  >
    <v-list density="compact" nav>
      <v-list-item>
        <v-text-field
          ref="input"
          v-model="search"
          :error="!navigation.length"
          placeholder="Filter navigation..."
          prepend-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          @click:prepend="onSearchClick"
        />
      </v-list-item>
      <template v-for="(group, groupIndex) in navigation" :key="groupIndex">
        <v-list-subheader
          v-if="group.children && group.title"
          class="d-block text-truncate pt-3"
          :title="group.title"
        />
        <v-list-item
          v-for="(item, itemIndex) in group.children"
          v-show="item.show"
          :key="itemIndex"
          v-bind="item"
          link
        ></v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>
