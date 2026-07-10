<script setup lang="ts">
// 極薄ページ(シングルビュー): URLパラメータの取り出しとContainerへの委譲のみ。
// 明細から商品詳細への遷移先パスもここで注入する(ルーティング知識のページ一元化)。
// ステータス遷移は画面遷移を伴わないその場更新なので、このページは関与しない。
import OrderDetailContainer from "~/features/order/components/OrderDetailContainer.vue";

useHead({ title: "注文詳細" });

const route = useRoute();
const orderId = route.params.id as string;

const productPath = (productId: string) => `/products/${productId}`;
</script>

<template>
  <div>
    <h1>注文詳細</h1>
    <OrderDetailContainer
      :order-id="orderId"
      :product-path="productPath"
    />
  </div>
</template>
