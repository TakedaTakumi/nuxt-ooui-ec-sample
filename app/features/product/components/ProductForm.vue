<script setup lang="ts">
// 入力系のドメインコンポーネント: 入力系Base部品の定型的な組み合わせと、
// 文字列入力 → ProductCreateInput への型変換・検証というドメイン知識を持つ。
// fetchや遷移は行わず、確定した入力を submit イベントで親(Container)へ報告するだけ。
import { computed, ref } from "vue";
import type { ProductCreateInput } from "../types/product";
import BaseButton from "~/components/ui/input/BaseButton.vue";
import BaseInput from "~/components/ui/input/BaseInput.vue";

defineProps<{
  submitting?: boolean;
}>();

const emit = defineEmits<{
  submit: [input: ProductCreateInput];
}>();

const name = ref("");
const price = ref("");
const stock = ref("");

// BaseInput は文字列で受け渡すため、数値への変換と妥当性判定はフォームが担う。
const parsed = computed<ProductCreateInput | undefined>(() => {
  const priceValue = Number(price.value);
  const stockValue = Number(stock.value);
  if (name.value.trim() === "") {
    return undefined;
  }
  if (price.value === "" || !Number.isFinite(priceValue) || priceValue < 0) {
    return undefined;
  }
  if (stock.value === "" || !Number.isInteger(stockValue) || stockValue < 0) {
    return undefined;
  }
  return { name: name.value.trim(), price: priceValue, stock: stockValue };
});

function onSubmit(): void {
  if (parsed.value !== undefined) {
    emit("submit", parsed.value);
  }
}
</script>

<template>
  <form
    class="product-form"
    @submit.prevent="onSubmit"
  >
    <BaseInput
      v-model="name"
      label="商品名"
      required
    />
    <BaseInput
      v-model="price"
      label="価格(円)"
      type="number"
      required
    />
    <BaseInput
      v-model="stock"
      label="在庫数"
      type="number"
      required
    />
    <BaseButton
      label="登録する"
      type="submit"
      :disabled="parsed === undefined || submitting"
    />
  </form>
</template>

<style scoped>
.product-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 360px;
}
</style>
