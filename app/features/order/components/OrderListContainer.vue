<script setup lang="ts">
// Container(コレクションビュー): データ取得のみを担い、表示はPresentationalへ委譲する。
// userId を渡すとその顧客の注文だけに絞り込む(顧客詳細ページへの埋め込み=協調で使用)。
import { useOrders } from "../composables/useOrders";
import { createFetchOrderRepository } from "../repositories/orderRepository";
import OrderList from "./OrderList.vue";

const props = defineProps<{
  detailPath: (id: string) => string;
  userId?: string;
}>();

const { list } = useOrders(createFetchOrderRepository());
const { data: orders } = await useAsyncData(
  `orders:${props.userId ?? "all"}`,
  () => list(props.userId),
);
</script>

<template>
  <OrderList
    :orders="orders ?? []"
    :detail-path="detailPath"
  />
</template>
