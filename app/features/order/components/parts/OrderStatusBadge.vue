<script setup lang="ts">
// 内部部品(parts/): OrderStatus → 色のマッピングを持つ。表示名はドメインの語彙
// (ORDER_STATUS_LABELS)を参照し、値→表示の対応がドメインと乖離しないようにする。
import { computed } from "vue";
import type { OrderStatus } from "../../types/order";
import { ORDER_STATUS_LABELS } from "../../domain/orderStatus";
import BaseBadge, { type BadgeColor } from "~/components/ui/display/BaseBadge.vue";

const props = defineProps<{
  status: OrderStatus;
}>();

const COLORS: Record<OrderStatus, BadgeColor> = {
  received: "blue",
  shipped: "orange",
  completed: "green",
  cancelled: "gray",
};

const label = computed(() => ORDER_STATUS_LABELS[props.status]);
const color = computed(() => COLORS[props.status]);
</script>

<template>
  <BaseBadge
    :label="label"
    :color="color"
  />
</template>
