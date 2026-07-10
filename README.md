# nuxt-ooui-ec-sample

Nuxt 3サンプルリポジトリ — ミニEC管理画面(OOUI × 分割統治)

アーキテクチャ規約([CLAUDE.md](./CLAUDE.md))と設計メモ(`.spec/nuxt-ooui-architecture-memo.md`)の**全規則を実コードで実演する**サンプルです。題材は顧客(user)・商品(product)・注文(order)を扱うミニEC管理画面で、文書の例示とコードが1:1で相互参照できることを最重視しています。

## オブジェクトとビュー(OOUI設計)

| オブジェクト | コレクション | シングル | アクション |
|---|---|---|---|
| user(顧客) | `/users` | `/users/:id` — その顧客の注文一覧を埋め込み(協調) | なし(Read only) |
| product(商品) | `/products` | `/products/:id` | `/products/create` — 保存後に詳細へリダイレクト(命令的遷移) |
| order(注文) | `/orders` | `/orders/:id` — 顧客カード+明細を埋め込み(協調) | ステータス遷移(その場更新のWriteアクション) |

## 起動方法(ホスト)

ホストには Docker / Docker Compose 以外のインストールは不要です。

```bash
mkdir -p ~/.claude          # 初回のみ(root所有での自動作成を回避)
docker compose up -d --build
# → http://localhost:3000
```

VSCode 派はコマンドパレット → `Dev Containers: Reopen in Container` →(必要なら)`pnpm dev`。

各種チェック:

```bash
docker compose run --rm app pnpm check:ci    # ESLint(--max-warnings=0)
docker compose run --rm app pnpm type-check  # nuxi typecheck
docker compose run --rm app pnpm test        # Vitest
docker compose run --rm app pnpm build       # nuxt build
```

## 規約⇔コード対応表

(構築完了時に完成させる — 各規約と実演箇所の対応を記載)

## 意図的な省略事項

サンプルの焦点(アーキテクチャ規約の実演)を薄めないための省略であり、規約上の禁止ではありません。

- 認証・認可(middleware)
- ページネーション・検索
- E2Eテスト(Playwright)
- i18n
- 本番デプロイ設定
- Pinia — 本サンプルにはアプリ横断のグローバル状態(認証・設定等)が存在しないため、規約「Piniaはアプリ横断のグローバル状態に限定」に従い**意図的に不使用**
- 段階3(Nuxt Layers / monorepo)への備え

## バージョン選定メモ(2026-07 構築時)

- Nuxt は **3.x 系最新(3.21.8)+ `future.compatibilityVersion: 4`**(`app/`構成)。4.x にはしない。
- typescript は 7.0.2 が @typescript-eslint(TS <6.1.0 要求)と不整合のため **5.9.3** を採用。
- eslint-plugin-sonarjs は 4.1.0 が ESLint 10 でロード時クラッシュするため **4.0.3** を採用。
