<script setup lang="ts">
// 内部部品(parts/): user feature 内からのみ参照される。
// UserStatus → 色・表示名のマッピングというドメイン知識をカプセル化しており、
// 素通しラッパーではない(小部品を作ってよい条件の実例)。
import { computed } from "vue";
import type { UserStatus } from "../../types/user";
import BaseBadge, { type BadgeColor } from "~/components/ui/display/BaseBadge.vue";

const props = defineProps<{
  status: UserStatus;
}>();

const appearance = computed<{ label: string; color: BadgeColor }>(() =>
  props.status === "active"
    ? { label: "有効", color: "green" }
    : { label: "停止中", color: "red" },
);
</script>

<template>
  <BaseBadge
    :label="appearance.label"
    :color="appearance.color"
  />
</template>
