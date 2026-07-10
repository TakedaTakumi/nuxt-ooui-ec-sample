<script setup lang="ts">
// 内部部品(parts/): 在庫数 → 状態表示(色・文言)のマッピングというドメイン知識を持つ。
import { computed } from "vue";
import BaseBadge, { type BadgeColor } from "~/components/ui/display/BaseBadge.vue";

const props = defineProps<{
  stock: number;
}>();

// 業務ルール: 0 = 在庫切れ、5以下 = 残りわずか。
const LOW_STOCK_THRESHOLD = 5;

const appearance = computed<{ label: string; color: BadgeColor }>(() => {
  if (props.stock === 0) {
    return { label: "在庫切れ", color: "red" };
  }
  if (props.stock <= LOW_STOCK_THRESHOLD) {
    return { label: `残りわずか(${props.stock})`, color: "orange" };
  }
  return { label: `在庫あり(${props.stock})`, color: "green" };
});
</script>

<template>
  <BaseBadge
    :label="appearance.label"
    :color="appearance.color"
  />
</template>
