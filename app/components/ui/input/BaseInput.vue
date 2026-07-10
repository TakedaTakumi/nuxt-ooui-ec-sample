<script setup lang="ts">
// 入力系: v-model(defineModel)準拠。ラベルと入力欄の定型的組み合わせを提供する。
withDefaults(defineProps<{
  label: string;
  type?: "text" | "number";
  required?: boolean;
}>(), {
  type: "text",
  required: false,
});

// 数値入力(type="number")でも DOM の value は文字列で届くため、
// 型変換の責務は利用側(フォーム)に置き、ここでは文字列のまま受け渡す。
const model = defineModel<string>({ required: true });
</script>

<template>
  <label class="base-input">
    <span class="base-input-label">{{ label }}</span>
    <input
      v-model="model"
      class="base-input-field"
      :type="type"
      :required="required"
    >
  </label>
</template>

<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
}

.base-input-label {
  color: #52606d;
}

.base-input-field {
  padding: 6px 10px;
  border: 1px solid #9aa5b1;
  border-radius: 4px;
  font-size: 14px;
}
</style>
