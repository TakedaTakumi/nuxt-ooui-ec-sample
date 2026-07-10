<script setup lang="ts">
// Presentational(コレクションビュー): props → 描画のみ。遷移先パスはpropsで注入される。
import type { Product } from "../types/product";
import BaseTable from "~/components/ui/display/BaseTable.vue";
import ProductStockBadge from "./parts/ProductStockBadge.vue";

defineProps<{
  products: Product[];
  detailPath: (id: string) => string;
}>();
</script>

<template>
  <BaseTable :headers="['商品名', '価格', '在庫']">
    <tr
      v-for="product in products"
      :key="product.id"
    >
      <td>
        <NuxtLink :to="detailPath(product.id)">{{ product.name }}</NuxtLink>
      </td>
      <td>¥{{ product.price.toLocaleString() }}</td>
      <td><ProductStockBadge :stock="product.stock" /></td>
    </tr>
  </BaseTable>
</template>
