<script setup lang="ts">
// 極薄ページ(コレクションビュー): ページメタ宣言とContainerへの委譲のみ。
// 遷移先パスの構築知識はページに一元化し、宣言的リンクとしてpropsで注入する。
import UserListContainer from "~/features/user/components/UserListContainer.vue";

useHead({ title: "顧客一覧" });

const detailPath = (id: string) => `/users/${id}`;
</script>

<template>
  <div>
    <h1>顧客一覧</h1>
    <UserListContainer :detail-path="detailPath" />
  </div>
</template>
