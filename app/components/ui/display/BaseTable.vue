<script setup lang="ts">
// 表示系: コレクションビューの器。ヘッダ行と表の体裁のみを担い、
// 行の中身(セルの構造・リンク)は利用側が slot で描画する。
// 行データの型を知らないことで、ドメイン型への依存を持たない。
defineProps<{
  headers: string[];
}>();
</script>

<template>
  <table class="base-table">
    <thead>
      <tr>
        <th
          v-for="header in headers"
          :key="header"
        >
          {{ header }}
        </th>
      </tr>
    </thead>
    <tbody>
      <slot />
    </tbody>
  </table>
</template>

<style scoped>
.base-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.base-table th {
  text-align: left;
  padding: 8px 12px;
  border-bottom: 2px solid #d9e2ec;
  color: #52606d;
  font-weight: 600;
}

.base-table :deep(td) {
  padding: 8px 12px;
  border-bottom: 1px solid #e4e7eb;
}
</style>
