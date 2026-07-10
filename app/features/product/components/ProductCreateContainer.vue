<script setup lang="ts">
// Container(作成アクション): フォームの確定入力を受けて作成APIを呼ぶ。
// 命令的遷移の実演: 結果は saved イベントで報告するだけで、navigateTo は呼ばない。
// どこへ遷移するか(するかどうか)はページが決める。
import { ref } from "vue";
import type { ProductCreateInput } from "../types/product";
import { useProducts } from "../composables/useProducts";
import { createFetchProductRepository } from "../repositories/productRepository";
import ProductForm from "./ProductForm.vue";

const emit = defineEmits<{
  saved: [id: string];
}>();

const { create } = useProducts(createFetchProductRepository());
const submitting = ref(false);
const errorMessage = ref("");

async function onSubmit(input: ProductCreateInput): Promise<void> {
  submitting.value = true;
  errorMessage.value = "";
  try {
    const product = await create(input);
    emit("saved", product.id);
  }
  catch {
    errorMessage.value = "商品の登録に失敗しました。時間をおいて再度お試しください。";
  }
  finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div>
    <ProductForm
      :submitting="submitting"
      @submit="onSubmit"
    />
    <p
      v-if="errorMessage"
      class="product-create-error"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped>
.product-create-error {
  color: #c92a2a;
  font-size: 14px;
}
</style>
