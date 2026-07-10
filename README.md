# nuxt-ooui-ec-sample

Nuxt 3サンプルリポジトリ — ミニEC管理画面(OOUI × 分割統治)

アーキテクチャ規約([CLAUDE.md](./CLAUDE.md))と設計メモ(`.spec/nuxt-ooui-architecture-memo.md`)の**全規則を実コードで実演する**サンプルです。題材は顧客(user)・商品(product)・注文(order)を扱うミニEC管理画面で、文書の例示とコードが1:1で相互参照できることを最重視しています。

## オブジェクトとビュー(OOUI設計)

| オブジェクト | コレクション | シングル | アクション |
|---|---|---|---|
| user(顧客) | `/users` | `/users/:id` — その顧客の注文一覧を埋め込み(協調) | なし(Read only) |
| product(商品) | `/products` | `/products/:id` | `/products/create` — 保存後に詳細へリダイレクト(命令的遷移) |
| order(注文) | `/orders` | `/orders/:id` — 顧客カード+明細を埋め込み(協調) | ステータス遷移(その場更新のWriteアクション) |

OOUI・REST・ルーティングの三位一体: コレクション ⇔ `GET /api/users` ⇔ `pages/users/index.vue`、シングル ⇔ `GET /api/users/:id` ⇔ `pages/users/[id].vue`(server/api/ と pages/ が鏡写し)。

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
docker compose run --rm app pnpm test        # Vitest(PBT含む35件)
docker compose run --rm app pnpm build       # nuxt build
```

> **注**: 本リポジトリの構築作業環境ではDockerが使えないため、Dockerイメージのビルドと
> devcontainer接続は未検証です(pnpm直接実行で上記4チェックの全通過は確認済み)。
> 初回起動で問題があれば `.spec/nuxt-env-setup-guide.md` §6「既知の落とし穴」を参照してください。

## 規約⇔コード対応表

[CLAUDE.md](./CLAUDE.md) の各規約と、それを実演しているコードの対応です。

| 規約 | リポジトリ内の実例 |
|---|---|
| 汎用UI/ドメイン2分類・依存一方向 | `app/components/ui/` はドメイン型のimportなし。全featureが `ui/` を利用し、逆流なし |
| 表示系/入力系の分離 | `ui/display/`(props-only)と `ui/input/`(v-model準拠)。`BaseButton` はclick発火=書き込み経路を持つため**入力系**(混合型ルールの適用例) |
| 素通しラッパー禁止・小部品の条件 | `features/user/components/parts/UserStatusBadge.vue`(status→色のマッピング)が `BaseBadge` をラップ。`UserForm` 的な素通しは作っていない |
| 配置の参照構造基準・昇格 | `features/user/components/UserCard.vue` はorder featureから参照されるため**ルート配置**。`UserAvatar` 等は `parts/` |
| feature間参照(ビューレベルのみ) | order→user: `OrderDetailContainer` が `UserCard` を埋め込み。user→order: `pages/users/[id].vue` が `OrderListContainer` を埋め込み。相互参照になるが規約上可(`parts/` への外部参照はなし) |
| フルネーム命名・Containerサフィックス | 全コンポーネントで実演。`Container` が付かないものはすべて表示専用(props+emitのみ) |
| 極薄ページ(4責務)・Container統一 | 全8ページ。fetchはページ直下のContainerのみが行う。`pages/users/[id].vue` は2つのContainerを並置しfetchのウォーターフォールを回避 |
| 命令的遷移のページ集約 | `ProductCreateContainer` は `saved` をemitするだけ。`pages/products/create.vue` が `navigateTo` を実行 |
| 宣言的リンクのprops注入 | 各一覧ページがパス構築関数(`detailPath`)を注入し、Presentational(`UserList` 等)は `NuxtLink` を描画するだけ。`UserList.test.ts` がルーターのモックなしでこれを検証 |
| 明示import・バレル禁止 | `nuxt.config.ts` で `imports.dirs: []` / `components.dirs: []`。`index.ts` による再exportなし |
| リポジトリ抽象とDIP | 各featureの `repositories/`: interface + fetch実装(本番) + InMemory実装(テスト)。composableは抽象にのみ依存し、テストはInMemory注入でHTTP不要 |
| 1 composable = 1責務 | `useUsers` / `useProducts` / `useOrders`(各featureの `composables/`) |
| 純粋ドメインロジックの分離(`domain/`) | `features/order/domain/orderTotal.ts`・`orderStatus.ts`。UIにもfetchにも依存せず、クライアント(Container/Presentational)とサーバー(`server/api/orders/[id]/status.patch.ts`)が同じ遷移規則を参照。fast-checkによるPBTの主対象 |
| Pinia限定使用 | **意図的に不使用**。本サンプルにはアプリ横断のグローバル状態(認証・設定等)が存在しないため、規約「Piniaはアプリ横断のグローバル状態に限定」に従い導入しない |

## テスト構成

テストは対象と同じディレクトリに併置しています(`foo.ts` の隣に `foo.test.ts`)。

| 対象 | 手法 | 内容 |
|---|---|---|
| `order/domain/orderTotal.ts` | **PBT(fast-check)** | 非負性・明細順序の入れ替え不変性・加法性 |
| `order/domain/orderStatus.ts` | **PBT(fast-check)** | 後退遷移不可・completed/cancelledの終端性・任意の遷移列での不変条件 |
| 各リポジトリInMemory実装 | ユニット | findAll/findの一貫性、createの反映、遷移規則違反のreject |
| 各composable | ユニット | InMemoryリポジトリ注入で検証(**DIPの実演**: ルーター・HTTP不要) |
| `UserList`(代表Presentational) | コンポーネント | props→描画、リンクパスがprops経由であること(NuxtLinkはスタブ) |

## 意図的な省略事項

サンプルの焦点(アーキテクチャ規約の実演)を薄めないための省略であり、規約上の禁止ではありません。

- 認証・認可(middleware)
- ページネーション・検索
- E2Eテスト(Playwright)
- i18n
- 本番デプロイ設定
- Pinia(上の対応表を参照 — 横断状態が存在しないため)
- 段階3(Nuxt Layers / monorepo)への備え

## バージョン選定メモ(2026-07 構築時)

`.spec/nuxt-env-setup-guide.md` §4の手順でregistry照会のうえ確定。

- **Nuxt 3.x系最新(3.21.8)+ `future.compatibilityVersion: 4`**(`app/`構成)。4.xにはしない。
- typescript は最新の7.0.2が @typescript-eslint(TS <6.1.0 要求)と不整合のため **5.9.3** を採用。
- eslint-plugin-sonarjs は最新の4.1.0がESLint 10でロード時クラッシュするため **4.0.3** を採用。
- pnpm 11 の形式に合わせ、ビルドスクリプト許可は `pnpm-workspace.yaml` の `allowBuilds` で
  esbuild / @parcel/watcher / unrs-resolver のみに限定(既定ブロックの方針は維持)。
- GitHub Actions はコミットSHAでpin(checkout v7.0.0 / setup-node v6.4.0 / pnpm/action-setup v6.0.9)。
