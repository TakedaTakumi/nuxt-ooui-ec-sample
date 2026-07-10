<script setup lang="ts">
// 極薄ページ(コレクションビュー): メタ宣言・Container委譲・リンクパスの注入のみ。
import OrderListContainer from "~/features/order/components/OrderListContainer.vue";

useHead({ title: "注文一覧" });

const detailPath = (id: string) => `/orders/${id}`;
</script>

<template>
  <div>
    <h1>注文一覧</h1>
    <OrderListContainer :detail-path="detailPath" />
  </div>
</template>
