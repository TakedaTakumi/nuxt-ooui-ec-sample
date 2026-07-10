<script setup lang="ts">
// Container(コレクションビュー): データ取得のみを担い、表示はPresentationalへ委譲する。
// リポジトリの具体実装はここで確定し、composableには抽象として渡す(DIP)。
import { useUsers } from "../composables/useUsers";
import { createFetchUserRepository } from "../repositories/userRepository";
import UserList from "./UserList.vue";

defineProps<{
  detailPath: (id: string) => string;
}>();

const { list } = useUsers(createFetchUserRepository());
const { data: users } = await useAsyncData("users", () => list());
</script>

<template>
  <UserList
    :users="users ?? []"
    :detail-path="detailPath"
  />
</template>
