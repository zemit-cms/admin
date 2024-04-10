<script setup lang="ts">
import {onMounted, ref} from "vue";

export interface Props {
  conditions?: any
}

const props = withDefaults(defineProps<Props>(), {
  conditions: () => ([]),
});

const sql = ref('')

function removeDataPrefix(key: string, prefix: string = 'data.') {
  if (key.startsWith(prefix)) {
    return key.substring(prefix.length);
  }
  return key;
}

function getSqlField(field: string) {
  return '`' + removeDataPrefix(field) + '`'
}

function getFirstBitwise(condition: any[]): string {
  if (!Array.isArray(condition[0])) {
    return (condition[0]?.bitwise || 'and').toUpperCase();
  }
  return getFirstBitwise(condition[0]);
}

function buildSql(conditions: Array<any>, level = 0) {
  let result: Array<string> = []
  const tabs = '\t'.repeat(level)
  const tabs2 = '\t'.repeat(level? level - 1 : 0)
  conditions.forEach((condition: any, index) => {
    if (Array.isArray(condition)) {
      const firstBitwise = index? getFirstBitwise(condition[0]) : '';
      result.push([
        tabs + firstBitwise,
        '(',
        buildSql(condition, level + 1).trim(),
        ')',
      ].join(' '))
    } else {
      result.push(tabs +
        [
          index? condition.bitwise.toUpperCase() : '',
          getSqlField(condition.field),
          condition.operator.toUpperCase() ,
          '"' + condition.value + '"',
        ].join(' ').trim()
      )
    }
  })
  return '\r\n' + tabs + '' + result.join('\r\n').trim() + ''
}

onMounted(() => {
  sql.value = 'SELECT * from `table` WHERE (' + buildSql(props.conditions, 1) + '\r\n)'
})
</script>

<template>
  <highlightjs
    language='sql'
    :code="sql"
  />
</template>
