<script setup lang="ts">
// 極薄ページ(コレクションビュー): メタ宣言・Container委譲・リンクパスの注入のみ。
import ProductListContainer from "~/features/product/components/ProductListContainer.vue";

useHead({ title: "商品一覧" });

const detailPath = (id: string) => `/products/${id}`;
</script>

<template>
  <div>
    <h1>商品一覧</h1>
    <p>
      <NuxtLink to="/products/create">＋ 商品を登録する</NuxtLink>
    </p>
    <ProductListContainer :detail-path="detailPath" />
  </div>
</template>
