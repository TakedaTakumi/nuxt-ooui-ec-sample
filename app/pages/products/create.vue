<script setup lang="ts">
// 極薄ページ(作成アクション): 命令的遷移の実演。
// Containerは saved をemitするだけで、保存後にどこへ遷移するかはこのページが決める。
import ProductCreateContainer from "~/features/product/components/ProductCreateContainer.vue";

useHead({ title: "商品登録" });

const detailPath = (id: string) => `/products/${id}`;
</script>

<template>
  <div>
    <h1>商品登録</h1>
    <ProductCreateContainer @saved="(id: string) => navigateTo(detailPath(id))" />
  </div>
</template>
