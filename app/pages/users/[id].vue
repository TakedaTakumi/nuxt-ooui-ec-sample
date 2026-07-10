<script setup lang="ts">
// 極薄ページ(シングルビュー): URLパラメータの取り出し・型変換とContainerへの委譲のみ。
import UserDetailContainer from "~/features/user/components/UserDetailContainer.vue";

useHead({ title: "顧客詳細" });

const route = useRoute();
const userId = route.params.id as string;
</script>

<template>
  <div>
    <h1>顧客詳細</h1>
    <UserDetailContainer :user-id="userId" />
  </div>
</template>
