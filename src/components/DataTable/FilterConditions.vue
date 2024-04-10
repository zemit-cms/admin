<script setup lang="ts">
import {ref, onMounted, nextTick, computed, PropType} from 'vue'
import {v4 as uuidv4} from 'uuid'
import draggable from 'vuedraggable'
import {ExtractProps} from '@/types/extract-props'
import {useRules} from '@/composables/rules'

export type filterOperator =
  'contains' |
  'does not contain' |
  'contains word' |
  'does not contain word' |
  'equals' |
  'does not equal' |
  'greater than' |
  'greater than or' |
  'less than' |
  'less than or' |
  'is empty' |
  'is not empty' |
  'regexp' |
  'not regexp'

export type filterBitwise =
  'and' |
  'or' |
  'xor'

export interface FilterInterface<V = any> {
  field: string,
  bitwise: filterBitwise,
  operator: filterOperator,
  value?: V,
  uuid: string,
}

const rules = useRules()

export interface Props
{
  headers?: Array<any>
  index?: number | undefined
  level?: number
  path?: string
  draggableProps?: ExtractProps<typeof draggable>
  operators?: Array<{ value: string, title: string }>
  bitwises?: Array<{ value: string, title: string }>
  density?: 'default' | 'compact' | 'comfortable'
}

const props = withDefaults(defineProps<Props>(), {
  headers: () => ([]),
  index: 0,
  level: 0,
  path: '0',
  draggableProps: () => ({}),
  operators: () => ([
    {value: 'contains', title: 'Contains'},
    {value: 'does not contain', title: 'Does not contain'},
    {value: 'contains word', title: 'Contains word'},
    {value: 'does not contain word', title: 'Does not contain word'},
    {value: 'equals', title: 'Equals'},
    {value: 'does not equal', title: 'Does not equal'},
    {value: 'greater than', title: 'Greater than'},
    {value: 'greater than or equal', title: 'Greater than or equal'},
    {value: 'less than', title: 'Less than'},
    {value: 'less than or equal', title: 'Less than or equal'},
    {value: 'is empty', title: 'Is empty'},
    {value: 'is not empty', title: 'Is not empty'},
    {value: 'regexp', title: 'Matches regular expression'},
    {value: 'not regexp', title: 'Does not match regular expression'},
  ]),
  bitwises: () => ([
    {value: 'and', title: 'AND'},
    {value: 'or', title: 'OR'},
    {value: 'xor', title: 'XOR'},
  ]),
})

const drag = ref(false)
const dragIndex = ref(0)
const dragLevel = ref(0)
const dragPath = ref('0')
const dragRemoved = ref(null)

export type filters<T = FilterInterface> = T | Array<filters<T>>

const model = defineModel({
  type: Array as PropType<Array<filters|any>>,
  default: () => ([]),
});

const firstBitwise = computed({
  get: () => {
    return nestingBitwise(model.value[props.index])
  },
  set: (value: filterBitwise) => {
    return nestingBitwise(model.value[props.index], value);
  }
})

function nestingBitwise(el: filters, value?: filterBitwise): filterBitwise {
  if (Array.isArray(el)) {
    if (el[0]) {
      return nestingBitwise(el[0], value);
    }
  } else if (el) {
    if (value) {
      el.bitwise = value;
    }
    return el.bitwise;
  }
  // should not happen but might happen during drags or deletes
  return 'and';
}

function showBitwise(index?: number): boolean {
  return !!index
}

function onAddConditionClick(index?: number) {
  addCondition(index)
}

function getNewConditionObject(): FilterInterface {
  return {
    field: '',
    operator: 'contains',
    value: '',
    bitwise: 'and',
    uuid: uuidv4(),
  }
}

function addCondition(index?: number) {
  const newCondition = getNewConditionObject()
  if (index !== undefined) {
    model.value[props.index].splice(index + 1, 0, newCondition);
  }
  else {
    model.value[props.index].push([newCondition])
  }
}

function onRemoveConditionClick(index: number) {
  removeCondition(index)
}

function removeCondition(index: number) {
  model.value[props.index].splice(index, 1)

  // remove empty group
  if (!model.value[props.index].length) {
    if (index === 0 && props.level === 0) {
      addCondition(0);
    } else {
      model.value.splice(props.index, 1)
    }
  }
}

function onMakeGroupClick(index: number) {
  makeGroup(index)
}

function makeGroup(index: number) {
  model.value[props.index][index] = [model.value[props.index][index]]
}

function onMoveGroupUpClick(index: number) {
  moveGroupUp(index)
}

function moveGroupUp(index: number) {
  // move group up using references and avoid cloning
  const groupToMove = model.value[props.index][index]
  model.value[props.index].splice(index, 1);
  model.value.splice(props.index, 0, groupToMove);

  // remove old group if empty
  const oldGroupIndex = props.index + 1;
  if (!model.value[oldGroupIndex].length) {
    model.value.splice(oldGroupIndex, 1);
  }
}

function removeEmptyGroupsFromList(list: Array<filters>): Array<filters> {
  function recursiveMap(element: any) {
    if (Array.isArray(element)) {
      element = element.map(recursiveMap).filter(el => el)
      return element.length ? element : null
    }
    return element
  }

  return list.map(recursiveMap).filter(el => el)
}

function removeEmptyGroups() {
  model.value = removeEmptyGroupsFromList(model.value)
}

function onDragStart() {
  dragPath.value = JSON.parse(JSON.stringify(props.path))
  dragIndex.value = JSON.parse(JSON.stringify(props.index))
  dragLevel.value = JSON.parse(JSON.stringify(props.level))
  drag.value = true
}

function onDragEnd() {
  drag.value = false
  // removeEmptyGroups()
}

async function onDragChange(change: any) {
  // bug fixes vue draggable nesting elements and groups using v-model
  if (change.added) {
    const elements: Array<FilterInterface> = Array.isArray(change.added.element) ? change.added.element : [change.added.element]
    await nextTick()
    const recursiveMap = (self = false) => (element: any, index: number): filters => {
      if (Array.isArray(element)) {
        const sameGroup = self
          && Array.isArray(change.added.element)
          && index === change.added.newIndex
        return sameGroup ? element : element.map(recursiveMap(false))
      }
      return self || (element && elements.findIndex((el) => el.uuid === element.uuid) === -1) ? element : null
    }
    model.value[props.index] = removeEmptyGroupsFromList(
      model.value[props.index].map(recursiveMap(true)),
    )
  }
  if (change.removed) {
    await nextTick()
    const elements: Array<FilterInterface> = Array.isArray(change.removed.element) ? change.removed.element : [change.removed.element]
    model.value[props.index] = removeEmptyGroupsFromList(model.value[props.index].filter((element: any) => !element.uuid || elements.findIndex(el => el.uuid === element.uuid) === -1));
  }

  removeEmptyGroups()
}

onMounted(() => {
  if (!model.value[props.index].length) {
    addCondition(0)
  }
})

defineExpose({
  getNewConditionObject,
  addCondition,
})
</script>

<template>
  <v-row
    no-gutters
    class="flex-nowrap"
  >
    <v-col
      v-if="level"
      cols="1"
      style="max-width: 28px;"
      class="flex-shrink-1 flex-grow-0"
    >
      <v-icon
        class="mt-2 sortable-handle cursor-grab"
        icon="mdi-drag"
        color="primary"
        @click.prevent
      />
    </v-col>
    <v-col
      cols="10"
      style="max-width: 100%"
      class="flex-grow-1 flex-shrink-0"
    >
      <v-divider style="position:relative; top:0; transform: translateY(20px);"/>
      <div
        style="max-width: 100px"
        v-if="level && model[index][0]"
      >
        <v-text-field
          v-if="!showBitwise(index)"
          value="WHERE"
          hide-details
          readonly
          variant="outlined"
          :bg-color="level % 2 === 0? 'grey-lighten-5' : 'white'"
          :density="density"
        />
        <v-autocomplete
          v-else
          v-model="firstBitwise"
          :items="props.bitwises"
          item-title="title"
          item-value="value"
          :density="density"
          variant="outlined"
          :rules="[rules.required]"
          :bg-color="level % 2 === 0? 'grey-lighten-5' : 'white'"
          hide-details
          auto-select-first
        />
      </div>
      <v-sheet
        border
      >
        <v-list
          class="mb-0"
          :class="{
            'pl-1': !level,
            'bg-grey-lighten-5': level % 2 !== 0
          }"
        >
          <draggable
            v-if="model[index]"
            v-model="model[index]"
            handle=".sortable-handle"
            @start="onDragStart"
            @end="onDragEnd"
            @change="onDragChange"
            item-key="uuid"
            :animation="222"
            :group="{
              name: 'selected-fields',
            }"
            :disabled="false"
            ghost-class="ghost"
            v-bind="draggableProps"
          >
            <template #item="{element: element, index: index}">
              <v-list-item
                class="pr-0 mr-0"
                :class="{
                  'pl-1': !level,
                  'bg-grey-lighten-5': level % 2 !== 0
                }"
              >
                <!-- SUB-GROUP -->
                <FilterConditions
                  v-if="Array.isArray(element)"
                  v-model="model[props.index]"
                  :index="index"
                  :level="level + 1"
                  :path="path + '.' + index"
                  :headers="headers"
                  :density="density"
                />

                <!-- ELEMENTS -->
                <v-row
                  v-else
                  no-gutters
                  class="flex-nowrap"
                >
                  <v-col
                    cols="1"
                    style="max-width: 28px"
                    class="flex-grow-0 flex-shrink-1"
                  >
                    <v-icon
                      class="mt-2 sortable-handle align-self-center cursor-grab"
                      icon="mdi-drag"
                      @click.prevent
                    />
                  </v-col>
                  <v-col
                    cols="1"
                    style="min-width: 100px"
                    class="flex-grow-0 flex-shrink-1"
                  >
                    <v-text-field
                      v-if="!showBitwise(index)"
                      v-model="element.bitwise"
                      :density="density"
                      :rules="[rules.required]"
                      value="WHERE"
                      hide-details
                      disabled
                      readonly
                      variant="outlined"
                    />
                    <v-autocomplete
                      v-else
                      v-model="element.bitwise"
                      :items="props.bitwises"
                      :density="density"
                      :rules="[rules.required]"
                      item-title="title"
                      item-value="value"
                      variant="outlined"
                      hide-details
                      auto-select-first
                    />
                  </v-col>
                  <v-col
                    cols="2"
                    style="min-width: 150px; max-width: 100%;"
                    class="flex-grow-1 flex-shrink-0"
                  >
                    <v-autocomplete
                      v-model="element.field"
                      :items="headers"
                      :density="density"
                      :rules="[rules.required]"
                      placeholder="Column"
                      item-title="title"
                      item-value="key"
                      variant="outlined"
                      hide-details
                      auto-select-first
                    />
                  </v-col>
                  <v-col
                    cols="2"
                    style="min-width: 150px; max-width: 100%;"
                    class="flex-grow-1 flex-shrink-0"
                  >
                    <v-autocomplete
                      v-model="element.operator"
                      :items="operators"
                      :density="density"
                      :rules="[rules.required]"
                      placeholder="Condition"
                      item-title="title"
                      item-value="value"
                      variant="outlined"
                      hide-details
                      auto-select-first
                    />
                  </v-col>
                  <v-col
                    cols="4"
                    style="min-width: 200px;"
                    class="flex-grow-0 flex-shrink-1"
                  >
                    <v-text-field
                      v-model="element.value"
                      :density="density"
                      :rules="[rules.required]"
                      placeholder="Value"
                      variant="outlined"
                      hide-details
                    />
                  </v-col>
                  <v-col
                    cols="2"
                    style="min-width: 150px; max-width: 100%;"
                    class="flex-grow-1 flex-shrink-0"
                  >
                    <v-btn
                      color="error"
                      icon="mdi-close"
                      variant="text"
                      size="small"
                      @click="() => onRemoveConditionClick(index)"
                    ></v-btn>
                    <v-btn
                      color="success"
                      icon="mdi-plus"
                      variant="text"
                      size="small"
                      @click="() => onAddConditionClick(index)"
                    ></v-btn>
                    <v-btn
                      v-if="!level || index"
                      color="default"
                      icon="mdi-arrow-right"
                      variant="text"
                      size="small"
                      @click="() => onMakeGroupClick(index)"
                    ></v-btn>
                    <v-btn
                      v-else
                      color="default"
                      icon="mdi-arrow-left"
                      variant="text"
                      size="small"
                      @click="() => onMoveGroupUpClick(index)"
                    ></v-btn>
                  </v-col>
                </v-row>
              </v-list-item>
            </template>
          </draggable>
        </v-list>
      </v-sheet>
    </v-col>
  </v-row>


</template>
