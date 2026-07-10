<script setup lang="ts">
// Container(シングルビュー): userId から顧客1件を取得しPresentationalへ委譲する。
import { useUsers } from "../composables/useUsers";
import { createFetchUserRepository } from "../repositories/userRepository";
import UserDetail from "./UserDetail.vue";

const props = defineProps<{
  userId: string;
}>();

const { detail } = useUsers(createFetchUserRepository());
const { data: user } = await useAsyncData(`user:${props.userId}`, () => detail(props.userId));
</script>

<template>
  <UserDetail
    v-if="user"
    :user="user"
  />
  <p v-else>
    顧客が見つかりません。
  </p>
</template>
