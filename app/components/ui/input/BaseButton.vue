<script setup lang="ts">
// 入力系: click の発火=親への書き込み経路を持つため、表示と入力を兼ねる
// 混合型ルール(書き込み経路を持つ時点で入力系)の適用例として input/ に置く。
withDefaults(defineProps<{
  label: string;
  type?: "button" | "submit";
  disabled?: boolean;
}>(), {
  type: "button",
  disabled: false,
});

const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <button
    class="base-button"
    :type="type"
    :disabled="disabled"
    @click="emit('click')"
  >
    {{ label }}
  </button>
</template>

<style scoped>
.base-button {
  padding: 6px 16px;
  border: 1px solid #1971c2;
  border-radius: 4px;
  background: #1971c2;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.base-button:hover:not(:disabled) {
  background: #1864ab;
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
