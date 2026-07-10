<script setup lang="ts">
// 表示系: シングルビューの器。タイトル + 本文(slot)のカード表示のみを担う。
defineProps<{
  title?: string;
}>();
</script>

<template>
  <section class="base-card">
    <h2
      v-if="title"
      class="base-card-title"
    >
      {{ title }}
    </h2>
    <div class="base-card-body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.base-card {
  border: 1px solid #d9e2ec;
  border-radius: 8px;
  padding: 16px 20px;
  background: #fff;
}

.base-card-title {
  margin: 0 0 12px;
  font-size: 16px;
}

.base-card-body {
  font-size: 14px;
}
</style>
