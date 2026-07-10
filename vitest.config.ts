import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    // ドメインロジック(純粋関数)中心は happy-dom で十分高速。
    // Nuxt ランタイム(useAsyncData 等)が必要なテストはファイル先頭の
    // `// @vitest-environment nuxt` でテスト単位に切り替える。
    environment: "happy-dom",
    globals: false,
  },
});
