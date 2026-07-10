<script setup lang="ts">
// 極薄ページ(シングルビュー): URLパラメータの取り出し・型変換とContainerへの委譲のみ。
import ProductDetailContainer from "~/features/product/components/ProductDetailContainer.vue";

useHead({ title: "商品詳細" });

const route = useRoute();
const productId = route.params.id as string;
</script>

<template>
  <div>
    <h1>商品詳細</h1>
    <ProductDetailContainer :product-id="productId" />
  </div>
</template>
