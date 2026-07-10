<script setup lang="ts">
// Container(シングルビュー): productId から商品1件を取得しPresentationalへ委譲する。
import { useProducts } from "../composables/useProducts";
import { createFetchProductRepository } from "../repositories/productRepository";
import ProductDetail from "./ProductDetail.vue";

const props = defineProps<{
  productId: string;
}>();

const { detail } = useProducts(createFetchProductRepository());
const { data: product } = await useAsyncData(
  `product:${props.productId}`,
  () => detail(props.productId),
);
</script>

<template>
  <ProductDetail
    v-if="product"
    :product="product"
  />
  <p v-else>
    商品が見つかりません。
  </p>
</template>
