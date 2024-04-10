<script setup lang="ts">
import {ComponentInstance, computed, onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {Service, AbstractService, ModelInterface} from 'zemit-sdk'
import {useDebounceFn} from "@vueuse/core";
import {VDataTable} from 'vuetify/components/VDataTable'
import {VDataTableServerProps} from "@/types/extract-props";
import OptionBtn from "@/components/DataTable/OptionBtn.vue";
import DensityBtn from "@/components/DataTable/DensityBtn.vue";
import FilterBtn from "@/components/DataTable/FilterBtn.vue";
import ExportBtn from "@/components/DataTable/ExportBtn.vue";

type VDataTableHeaders = typeof VDataTable["headers"];
interface DataTableHeaders extends VDataTableHeaders {
  searchable?: boolean;
}

export interface Props {
  dataTableServerProps?: Partial<VDataTableServerProps>
  headers?: DataTableHeaders[]
  formComponent?: ComponentInstance<any>
  service: Service | AbstractService,
}

const props = withDefaults(defineProps<Props>(), {
  dataTableServerProps: () => ({}),
  service: () => new Service()
})

const filteredHeaders = computed<VDataTableHeaders>(() => {
  const dataTableHeaders = props.headers;

  // no headers
  if (!dataTableHeaders) return null;

  // no columns filtered
  if (!columns.value.length) return dataTableHeaders

  const ret: any[] = [];
  columns.value.forEach((column: any) => {
    // remove columns
    if (column.display) {
      const index = dataTableHeaders.findIndex((header) => {
        return header.key === column.key
      })
      if (index !== -1) {
        // add as header and override default properties
        // - remove sortable from native vuetify datatable
        ret.push({...dataTableHeaders[index], ...{
          sortable: false,
        }})
      }
    }
  })
  return ret;
})

const route = useRoute()
const loading = ref(true)
const dialog = ref(false)
const searchLoading = ref(false)
const searchFocus = ref(false)
const search = ref('')
const serverItems = ref([])
const itemsPerPage = ref(25)
const totalItems = ref(0)
const groupBy = ref<Array<any>>([])
const density = ref<VDataTable["density"]>('default')
const record = ref<ModelInterface>()

const filters = ref([])
const sorts = ref([])
const groups = ref([])
const columns = ref([])

watch(search, () => {
  searchLoading.value = true
  debouncedLoadItems()
})

const debouncedLoadItems = useDebounceFn(() => {
  loadItems()
}, 222)
function loadItems() {
  if (!searchLoading.value) {
    loading.value = true;
  }
  const query = buildQuery()
  props.service.find(query).then((response: any) => {
    const view = response.data.view;
    totalItems.value = view.totalCount || 0
    if (view.data) {
      // generateHeaders(view.data)
      serverItems.value = view.data
    }
  }).finally(() => {
    loading.value = false
    searchLoading.value = false
  })
}

function buildQuery() {
  const query = {
    search: search.value,
    order: [] as Array<string>,
  }
  sorts.value.forEach((sort: any) => {
    query.order.push(removeDataPrefix(sort.key) + ' ' + sort.order)
  })
  return query;
}

function removeDataPrefix(key: string, prefix: string = 'data.') {
  if (key.startsWith(prefix)) {
    return key.substring(prefix.length);
  }
  return key;
}

function onEditItemClick(item: ModelInterface) {
  edit(item)
}

function edit(item: ModelInterface) {
  record.value = item;
  openDialog()
}

function openDialog() {
  dialog.value = true
}

function onDeleteItemClick(item: ModelInterface) {
  item._deleting = true
  props.service.delete({id: item.id}).then((response: any) => {
    if (response.data.view.data) {
      Object.assign(item, response.data.view.data);
    }
  }).finally(() => item._deleting = false)
}

function onRestoreItemClick(item: ModelInterface) {
  item._restoring = true
  props.service.restore({id: item.id}).then((response: any) => {
    if (response.data.view.data) {
      Object.assign(item, response.data.view.data);
    }
  }).finally(() => item._restoring = false)
}

// const headers: Ref<Array<any>> = ref([])
// function generateHeaders(list: Array<Model>) {
//   headers.value = [];
//   const model = list[0] as Model;
//   Object.keys(model.data).forEach((key: string) => {
//     headers.value.push({
//       title: getTitleFromKey(key),
//       sortable: true,
//       align: 'start',
//       key: 'data.' + key
//     });
//   })
// }

function getTitleFromKey(key: string) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, function(str) {
      return str.toUpperCase();
    })
}

function onSortsChange() {
  loadItems()
}
function onGroupsChange() {
  groupBy.value = [];
  groups.value.forEach((group: any) => {
    groupBy.value.push({
      key: group.key,
      order: group.order,
    })
  })
}
function onColumnsChange() {
  // nothing
}

function onFiltersChange() {
  // nothing
}

function getHeader(key: string) {
  return props.headers?.find((header) => header.key === key)
}

onMounted(() => {
  loadItems()
})
</script>

<template>
  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">

<!--      <v-btn-->
<!--        flat-->
<!--        icon="mdi-plus"-->
<!--      >-->
<!--      </v-btn>-->

<!--      <v-icon icon="mdi-account-multiple"></v-icon>-->
<!--      &nbsp;-->
<!--      Users-->

        <OptionBtn
          v-model="columns"
          variant="columns"
          :headers="headers"
          @update:model-value="onColumnsChange"
        />

        <FilterBtn
          v-model="filters"
          :headers="headers"
          @update:model-value="onFiltersChange"
        />

        <OptionBtn
          v-model="groups"
          variant="group"
          :headers="headers"
          @update:model-value="onGroupsChange"
        />

        <OptionBtn
          v-model="sorts"
          variant="sort"
          :headers="headers"
          @update:model-value="onSortsChange"
        />

        <v-btn
          class="mr-2"
          prepend-icon="mdi-format-color-fill"
          variant="text"
        >
          Color
        </v-btn>

        <DensityBtn
          v-model="density"
        />

        <ExportBtn
        />

        <v-btn
          class="mr-2"
          prepend-icon="mdi-arrow-expand"
          variant="text"
          size="small"
        >
        </v-btn>

        <v-spacer></v-spacer>

      <v-text-field
        v-model="search"
        :loading="searchLoading"
        prepend-inner-icon="mdi-magnify"
        label="Search"
        single-line
        flat
        hide-details
        :density="density"
        variant="solo-filled"
        :class="{
          'w-100': searchFocus
        }"
        style="width: 200px; transition: width 0.5s ease;"
        @focusin="searchFocus = true"
        @focusout="searchFocus = false"
      >
        <!--        <template #append-inner>-->
        <!--          <v-progress-circular-->
        <!--            v-if="searchLoading"-->
        <!--            indeterminate-->
        <!--            color="grey"-->
        <!--            :size="22"-->
        <!--            :width="2"-->
        <!--          />-->
        <!--        </template>-->
      </v-text-field>
    </v-card-title>

    <v-divider></v-divider>

    <v-data-table
      v-model:items-per-page="itemsPerPage"
      select-strategy="page"
      :items-length="totalItems"
      :items="serverItems"
      item-value="data.id"
      :loading="loading"
      :search="search"
      :group-by="groupBy"
      show-select
      show-expand
      v-bind="dataTableServerProps"
      :headers="filteredHeaders"
      :density="density"
    >
<!--      <template v-slot:thead="{ headers }">-->
<!--        <tr>-->
<!--          <th-->
<!--            v-for="header in headers[0]"-->
<!--            :key="header.key"-->
<!--          >-->
<!--            <v-text-field-->
<!--              v-if="header.searchable && header.key"-->
<!--              variant="solo-filled"-->
<!--              :density="density"-->
<!--              flat-->
<!--              hide-details-->
<!--            ></v-text-field>-->
<!--          </th>-->
<!--        </tr>-->
<!--      </template>-->

      <template v-slot:[`item.__action__`]="{ item }">
        <v-btn
          color="primary"
          icon="mdi-pencil"
          variant="text"
          :density="density"
          @click="onEditItemClick(item)"
          v-bind="getHeader('__action__')?.editBtnBind || {}"
          v-on="getHeader('__action__')?.editBtnOn || {}"
        >
        </v-btn>
        <v-btn
          v-if="!item.deleted"
          color="error"
          icon="mdi-close"
          variant="text"
          :density="density"
          :loading="item._deleting"
          @click="onDeleteItemClick(item)"
        >
        </v-btn>
        <v-btn
          v-else
          color="success"
          icon="mdi-refresh"
          variant="text"
          :density="density"
          :loading="item._restoring"
          @click="onRestoreItemClick(item)"
        >
        </v-btn>
      </template>

      <template v-slot:loading v-if="!serverItems.length">
        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
      </template>

      <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
        <tr>
          <td :colspan="columns.length">
            <VBtn
              size="small"
              variant="text"
              :prepend-icon="isGroupOpen(item) ? '$expand' : '$next'"
              @click="toggleGroup(item)"
            >
              {{ item.value }}
            </VBtn>

          </td>
        </tr>
      </template>

      <template v-slot:expanded-row="{ columns, item }">
        <slot
          name="expanded-row"
          v-bind="{ columns, item }"
        >
        </slot>
      </template>

      <template v-slot:[`footer.prepend`]>
        <v-btn
          variant="text"
        >
          Clear
        </v-btn>
        <v-spacer/>
      </template>
    </v-data-table>
  </v-card>

  <v-dialog
    v-model="dialog"
    width="1024"
  >
    <component
      :is="formComponent"
      :record="record"
    >
      <template #append-top-action>
        TEST
      </template>
    </component>
  </v-dialog>
</template>
