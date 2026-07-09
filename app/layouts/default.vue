<script setup lang="ts">
// ルートナビゲーション: OOUIのメインオブジェクト(user / product / order)を常設する。
// NuxtLink は Nuxt 組み込みコンポーネントなので自動 import の対象外(規約どおりそのまま使用可)。
</script>

<template>
  <div class="layout">
    <header class="layout-header">
      <NuxtLink
        to="/"
        class="layout-title"
      >
        ミニEC管理画面
      </NuxtLink>
      <nav class="layout-nav">
        <NuxtLink to="/users">
          顧客
        </NuxtLink>
        <NuxtLink to="/products">
          商品
        </NuxtLink>
        <NuxtLink to="/orders">
          注文
        </NuxtLink>
      </nav>
    </header>
    <main class="layout-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.layout {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 16px;
  font-family: system-ui, sans-serif;
  color: #1f2933;
}

.layout-header {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px 0;
  border-bottom: 1px solid #d9e2ec;
}

.layout-title {
  font-size: 18px;
  font-weight: 700;
  color: inherit;
  text-decoration: none;
}

.layout-nav {
  display: flex;
  gap: 16px;
}

.layout-nav a {
  color: #334e68;
  text-decoration: none;
}

.layout-nav a.router-link-active {
  font-weight: 700;
  text-decoration: underline;
}

.layout-main {
  padding: 24px 0;
}
</style>
