<script setup lang="ts">
// Presentational(シングルビュー): props → 描画のみ。
import type { User } from "../types/user";
import BaseCard from "~/components/ui/display/BaseCard.vue";
import UserAvatar from "./parts/UserAvatar.vue";
import UserStatusBadge from "./parts/UserStatusBadge.vue";

defineProps<{
  user: User;
}>();
</script>

<template>
  <BaseCard title="顧客情報">
    <dl class="user-detail">
      <dt>顧客名</dt>
      <dd>
        <UserAvatar :name="user.name" />
        <span>{{ user.name }}</span>
      </dd>
      <dt>メールアドレス</dt>
      <dd>{{ user.email }}</dd>
      <dt>ステータス</dt>
      <dd><UserStatusBadge :status="user.status" /></dd>
    </dl>
  </BaseCard>
</template>

<style scoped>
.user-detail {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 8px 16px;
  margin: 0;
}

.user-detail dt {
  color: #52606d;
}

.user-detail dd {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
