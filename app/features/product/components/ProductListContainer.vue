<script setup lang="ts">
// Container(コレクションビュー): データ取得のみを担い、表示はPresentationalへ委譲する。
import { useProducts } from "../composables/useProducts";
import { createFetchProductRepository } from "../repositories/productRepository";
import ProductList from "./ProductList.vue";

defineProps<{
  detailPath: (id: string) => string;
}>();

const { list } = useProducts(createFetchProductRepository());
const { data: products } = await useAsyncData("products", () => list());
</script>

<template>
  <ProductList
    :products="products ?? []"
    :detail-path="detailPath"
  />
</template>
