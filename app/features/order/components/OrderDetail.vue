<script setup lang="ts">
// Presentational(シングルビュー): props → 描画のみ。
// ステータス遷移ボタンは押された事実を change-status でemitするだけで、更新はContainerが担う。
// 遷移可能なステータスの判定はdomain/の純粋関数に委ねる。
import { computed } from "vue";
import type { Order, OrderStatus } from "../types/order";
import { ORDER_STATUS_LABELS, nextStatuses } from "../domain/orderStatus";
import BaseCard from "~/components/ui/display/BaseCard.vue";
import BaseButton from "~/components/ui/input/BaseButton.vue";
import OrderLineTable from "./parts/OrderLineTable.vue";
import OrderStatusBadge from "./parts/OrderStatusBadge.vue";

const props = defineProps<{
  order: Order;
  productPath: (productId: string) => string;
  updating?: boolean;
}>();

const emit = defineEmits<{
  changeStatus: [to: OrderStatus];
}>();

const formatDate = (isoString: string) => isoString.slice(0, 10).replaceAll("-", "/");

const availableStatuses = computed(() => nextStatuses(props.order.status));
</script>

<template>
  <div class="order-detail">
    <BaseCard title="注文情報">
      <dl class="order-detail-fields">
        <dt>注文番号</dt>
        <dd>{{ order.id }}</dd>
        <dt>注文日</dt>
        <dd>{{ formatDate(order.orderedAt) }}</dd>
        <dt>ステータス</dt>
        <dd class="order-detail-status">
          <OrderStatusBadge :status="order.status" />
          <BaseButton
            v-for="status in availableStatuses"
            :key="status"
            :label="`${ORDER_STATUS_LABELS[status]}にする`"
            :disabled="updating"
            @click="emit('changeStatus', status)"
          />
        </dd>
      </dl>
    </BaseCard>
    <BaseCard title="注文明細">
      <OrderLineTable
        :order-lines="order.orderLines"
        :product-path="productPath"
      />
    </BaseCard>
  </div>
</template>

<style scoped>
.order-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-detail-fields {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 8px 16px;
  margin: 0;
}

.order-detail-fields dt {
  color: #52606d;
}

.order-detail-fields dd {
  margin: 0;
}

.order-detail-status {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
