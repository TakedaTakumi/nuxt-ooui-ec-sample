<script setup lang="ts">
// Presentational(コレクションビュー): props → 描画のみ。
// 遷移先パスはページから注入され(宣言的リンク)、パス構築の知識を持たない。
import type { User } from "../types/user";
import BaseTable from "~/components/ui/display/BaseTable.vue";
import UserStatusBadge from "./parts/UserStatusBadge.vue";

defineProps<{
  users: User[];
  detailPath: (id: string) => string;
}>();
</script>

<template>
  <BaseTable :headers="['顧客名', 'メールアドレス', 'ステータス']">
    <tr
      v-for="user in users"
      :key="user.id"
    >
      <td>
        <NuxtLink :to="detailPath(user.id)">{{ user.name }}</NuxtLink>
      </td>
      <td>{{ user.email }}</td>
      <td><UserStatusBadge :status="user.status" /></td>
    </tr>
  </BaseTable>
</template>
