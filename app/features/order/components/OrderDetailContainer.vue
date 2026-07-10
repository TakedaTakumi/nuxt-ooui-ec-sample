<script setup lang="ts">
// Container(シングルビュー): 注文と購入者を取得し、Presentationalへ委譲する。
// オブジェクト協調(order → user)の実演:
// - コンポーネントは相手featureのビューレベル(UserCard)のみを参照する(parts/は参照しない)
// - 購入者データの取得はuser featureのリポジトリ抽象+composableを経由する
// ステータス遷移は画面遷移を伴わないその場更新のWriteアクションなので、
// ページにemitせずこのContainerが更新と再取得を完結させる。
import { ref } from "vue";
import type { OrderStatus } from "../types/order";
import { useOrders } from "../composables/useOrders";
import { createFetchOrderRepository } from "../repositories/orderRepository";
import { useUsers } from "~/features/user/composables/useUsers";
import { createFetchUserRepository } from "~/features/user/repositories/userRepository";
import UserCard from "~/features/user/components/UserCard.vue";
import OrderDetail from "./OrderDetail.vue";

const props = defineProps<{
  orderId: string;
  // 商品詳細への遷移先パス。ルーティング知識はページが持ち、ここは受け渡すだけ。
  productPath: (productId: string) => string;
}>();

const { detail, updateStatus } = useOrders(createFetchOrderRepository());
const { detail: userDetail } = useUsers(createFetchUserRepository());

// 購入者は注文のuserIdに依存するため、1つのuseAsyncDataでまとめて取得する
// (Containerをページ直下に保ち、fetchのネストによるウォーターフォールを作らない)。
const { data, refresh } = await useAsyncData(`order:${props.orderId}`, async () => {
  const order = await detail(props.orderId);
  const user = await userDetail(order.userId);
  return { order, user };
});

const updating = ref(false);

async function onChangeStatus(to: OrderStatus): Promise<void> {
  updating.value = true;
  try {
    await updateStatus(props.orderId, to);
    await refresh();
  }
  finally {
    updating.value = false;
  }
}
</script>

<template>
  <div
    v-if="data"
    class="order-detail-container"
  >
    <OrderDetail
      :order="data.order"
      :product-path="productPath"
      :updating="updating"
      @change-status="onChangeStatus"
    />
    <UserCard :user="data.user" />
  </div>
  <p v-else>
    注文が見つかりません。
  </p>
</template>
