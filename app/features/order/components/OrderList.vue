<script setup lang="ts">
// Presentational(コレクションビュー): props → 描画のみ。遷移先パスはpropsで注入される。
// 合計金額の計算はdomain/の純粋関数を利用する。
import type { Order } from "../types/order";
import { orderTotal } from "../domain/orderTotal";
import BaseTable from "~/components/ui/display/BaseTable.vue";
import OrderStatusBadge from "./parts/OrderStatusBadge.vue";

defineProps<{
  orders: Order[];
  detailPath: (id: string) => string;
}>();

// ISO 8601 の日付部分を "YYYY/MM/DD" で表示する(ロケール依存を避けSSRとの差異を防ぐ)。
const formatDate = (isoString: string) => isoString.slice(0, 10).replaceAll("-", "/");
</script>

<template>
  <BaseTable :headers="['注文番号', '注文日', 'ステータス', '合計金額']">
    <tr
      v-for="order in orders"
      :key="order.id"
    >
      <td>
        <NuxtLink :to="detailPath(order.id)">{{ order.id }}</NuxtLink>
      </td>
      <td>{{ formatDate(order.orderedAt) }}</td>
      <td><OrderStatusBadge :status="order.status" /></td>
      <td>¥{{ orderTotal(order.orderLines).toLocaleString() }}</td>
    </tr>
  </BaseTable>
</template>
