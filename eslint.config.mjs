// @ts-check
import sonarjs from "eslint-plugin-sonarjs";
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  // 複雑度ガード: 認知的複雑度 15 / 関数 80 行を warn
  {
    plugins: { sonarjs },
    rules: {
      "sonarjs/cognitive-complexity": ["warn", 15],
      "max-lines-per-function": ["warn", { max: 80, skipBlankLines: true, skipComments: true }],
    },
  },
  // テストは関数長を 300 行に緩和
  {
    files: ["**/*.test.ts"],
    rules: {
      "max-lines-per-function": ["warn", { max: 300, skipBlankLines: true, skipComments: true }],
    },
  },
);
