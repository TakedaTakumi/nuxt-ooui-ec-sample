<script setup lang="ts">
// Presentational: 顧客の要約カード。
// order feature(注文詳細の購入者表示)から参照されるため、parts/ ではなく
// components/ 直下(ビューレベル)に置く — 配置の参照構造基準の実例。
import type { User } from "../types/user";
import BaseCard from "~/components/ui/display/BaseCard.vue";
import UserAvatar from "./parts/UserAvatar.vue";
import UserStatusBadge from "./parts/UserStatusBadge.vue";

defineProps<{
  user: User;
}>();
</script>

<template>
  <BaseCard title="購入者">
    <div class="user-card">
      <UserAvatar :name="user.name" />
      <div class="user-card-body">
        <span class="user-card-name">{{ user.name }}</span>
        <span class="user-card-email">{{ user.email }}</span>
      </div>
      <UserStatusBadge :status="user.status" />
    </div>
  </BaseCard>
</template>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-card-body {
  display: flex;
  flex-direction: column;
}

.user-card-name {
  font-weight: 600;
}

.user-card-email {
  color: #52606d;
  font-size: 12px;
}
</style>
