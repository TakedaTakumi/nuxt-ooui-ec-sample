<script setup lang="ts">
// 内部部品(parts/): 明細の表形式表示。小計・合計の計算はdomain/の純粋関数に委ねる。
// 商品詳細への遷移先パスはページから(OrderDetail経由で)注入される。
import type { OrderLine } from "../../types/order";
import { orderLineTotal, orderTotal } from "../../domain/orderTotal";
import BaseTable from "~/components/ui/display/BaseTable.vue";

defineProps<{
  orderLines: OrderLine[];
  productPath: (productId: string) => string;
}>();
</script>

<template>
  <div>
    <BaseTable :headers="['商品', '単価', '数量', '小計']">
      <tr
        v-for="line in orderLines"
        :key="line.productId"
      >
        <td>
          <NuxtLink :to="productPath(line.productId)">{{ line.productId }}</NuxtLink>
        </td>
        <td>¥{{ line.unitPrice.toLocaleString() }}</td>
        <td>{{ line.quantity }}</td>
        <td>¥{{ orderLineTotal(line).toLocaleString() }}</td>
      </tr>
    </BaseTable>
    <p class="order-line-total">
      合計: <strong>¥{{ orderTotal(orderLines).toLocaleString() }}</strong>
    </p>
  </div>
</template>

<style scoped>
.order-line-total {
  text-align: right;
  font-size: 14px;
}
</style>
