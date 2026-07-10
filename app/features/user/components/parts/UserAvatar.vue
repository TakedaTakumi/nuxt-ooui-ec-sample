<script setup lang="ts">
// 内部部品(parts/): 顧客名 → 表示イニシャルの導出というドメイン知識を持つ。
import { computed } from "vue";

const props = defineProps<{
  name: string;
}>();

// 「姓 名」形式の先頭1文字をイニシャルとして表示する(空文字は "?" にフォールバック)。
const initial = computed(() => props.name.trim().charAt(0) || "?");
</script>

<template>
  <span
    class="user-avatar"
    aria-hidden="true"
  >{{ initial }}</span>
</template>

<style scoped>
.user-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #334e68;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
}
</style>
