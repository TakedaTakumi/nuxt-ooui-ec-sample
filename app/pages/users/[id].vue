<script setup lang="ts">
// 極薄ページ(シングルビュー): URLパラメータの取り出し・型変換とContainerへの委譲のみ。
// オブジェクト協調(user → order)の実演: この顧客の注文一覧を埋め込む。
// 2つのContainerをどちらもページ直下に並べ、fetchのネスト(ウォーターフォール)を作らない。
import OrderListContainer from "~/features/order/components/OrderListContainer.vue";
import UserDetailContainer from "~/features/user/components/UserDetailContainer.vue";

useHead({ title: "顧客詳細" });

const route = useRoute();
const userId = route.params.id as string;

const orderDetailPath = (id: string) => `/orders/${id}`;
</script>

<template>
  <div>
    <h1>顧客詳細</h1>
    <UserDetailContainer :user-id="userId" />
    <h2>この顧客の注文</h2>
    <OrderListContainer
      :user-id="userId"
      :detail-path="orderDetailPath"
    />
  </div>
</template>
