<script setup lang="ts">
// 入力系: v-model(defineModel)準拠のセレクトボックス。
// 選択肢は value/label の組で受け取り、意味づけ(どの値が何を表すか)は利用側が持つ。
export interface SelectOption {
  value: string;
  label: string;
}

defineProps<{
  label: string;
  options: SelectOption[];
}>();

const model = defineModel<string>({ required: true });
</script>

<template>
  <label class="base-select">
    <span class="base-select-label">{{ label }}</span>
    <select
      v-model="model"
      class="base-select-field"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </label>
</template>

<style scoped>
.base-select {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
}

.base-select-label {
  color: #52606d;
}

.base-select-field {
  padding: 6px 10px;
  border: 1px solid #9aa5b1;
  border-radius: 4px;
  font-size: 14px;
  background: #fff;
}
</style>
