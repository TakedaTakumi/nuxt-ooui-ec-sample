export default defineNuxtConfig({
  modules: ["@nuxt/eslint"],

  // 自作コードの自動 import を無効化(アーキテクチャ規約: 明示 import)。
  // 依存関係を grep と定義ジャンプで追跡可能に保つため。
  components: { dirs: [] },
  imports: { dirs: [] },

  // Nuxt 3 のまま app/ ディレクトリ構成(Nuxt 4 スタイル)を使う。
  // アーキテクチャメモのディレクトリ例(app/pages, app/features, ...)と一致させるため。
  future: { compatibilityVersion: 4 },

  typescript: {
    strict: true,
  },

  eslint: {
    config: {
      // ESLint Stylistic で整形まで一本化(Prettier 不使用)。
      // 規約: indent 2 / double quotes / semi always / trailing commas(multiline)
      stylistic: {
        indent: 2,
        quotes: "double",
        semi: true,
        commaDangle: "always-multiline",
      },
    },
  },
});
