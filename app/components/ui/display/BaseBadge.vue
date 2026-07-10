<script setup lang="ts">
// 表示系: props のみで完結する純粋な「データ → 描画」写像(defineEmits 禁止)。
// 色の意味づけ(どの状態が何色か)はドメイン側の小部品が担い、ここは色名しか知らない。
export type BadgeColor = "gray" | "green" | "blue" | "orange" | "red";

withDefaults(defineProps<{
  label: string;
  color?: BadgeColor;
}>(), {
  color: "gray",
});
</script>

<template>
  <span
    class="base-badge"
    :class="`base-badge--${color}`"
  >{{ label }}</span>
</template>

<style scoped>
.base-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 1.6;
  white-space: nowrap;
}

.base-badge--gray {
  background: #e4e7eb;
  color: #3e4c59;
}

.base-badge--green {
  background: #d3f9d8;
  color: #2b8a3e;
}

.base-badge--blue {
  background: #d0ebff;
  color: #1971c2;
}

.base-badge--orange {
  background: #ffe8cc;
  color: #d9480f;
}

.base-badge--red {
  background: #ffe3e3;
  color: #c92a2a;
}
</style>
