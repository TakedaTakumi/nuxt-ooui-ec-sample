<script setup lang="ts">
// Presentational(シングルビュー): props → 描画のみ。
import type { Product } from "../types/product";
import BaseCard from "~/components/ui/display/BaseCard.vue";
import ProductStockBadge from "./parts/ProductStockBadge.vue";

defineProps<{
  product: Product;
}>();
</script>

<template>
  <BaseCard title="商品情報">
    <dl class="product-detail">
      <dt>商品名</dt>
      <dd>{{ product.name }}</dd>
      <dt>価格</dt>
      <dd>¥{{ product.price.toLocaleString() }}</dd>
      <dt>在庫</dt>
      <dd><ProductStockBadge :stock="product.stock" /></dd>
    </dl>
  </BaseCard>
</template>

<style scoped>
.product-detail {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 8px 16px;
  margin: 0;
}

.product-detail dt {
  color: #52606d;
}

.product-detail dd {
  margin: 0;
}
</style>
