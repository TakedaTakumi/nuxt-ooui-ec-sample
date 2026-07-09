<script setup lang="ts">
// トップページ: 各コレクションビューへの入口のみの簡素なページ。
useHead({ title: "ミニEC管理画面" });
</script>

<template>
  <div>
    <h1>ミニEC管理画面</h1>
    <p>OOUI × 分割統治のアーキテクチャ規約を実演するサンプルです。</p>
    <ul>
      <li>
        <NuxtLink to="/users">顧客一覧</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/products">商品一覧</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/orders">注文一覧</NuxtLink>
      </li>
    </ul>
  </div>
</template>
