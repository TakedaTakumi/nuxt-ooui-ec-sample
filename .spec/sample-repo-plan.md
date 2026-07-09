# サンプルリポジトリ構築計画書 — ミニEC管理画面(OOUI × 分割統治)

作成日: 2026-07-07 / 対象: GitHubに公開するNuxt 3サンプルリポジトリ

## 1. 目的とスコープ

アーキテクチャメモ(`nuxt-ooui-architecture-memo.md`)とアーキテクチャ規約(`claude-md-draft.md`)の**全規則を実コードで実演する**サンプルリポジトリを構築する。題材はミニEC管理画面(顧客・商品・注文)。文書の例示がuser/product/orderで書かれているため、文書とコードが1:1で相互参照できることを最重視する。

- 前提構成: **段階2(オブジェクト単位のfeature別)**。段階3(Nuxt Layers/monorepo)は考慮しない。
- 提案リポジトリ名: `nuxt-ooui-ec-sample`(変更可)。

## 2. ユースケース(OOUI設計 — 3ステップの実演)

### 2-1. オブジェクトの抽出(モデル)
- **User(顧客)**: id, name, email, status(active/suspended)
- **Product(商品)**: id, name, price, stock
- **Order(注文)**: id, userId, orderLines[], status(received→shipped→completed / cancelled), orderedAt
- **OrderLine(明細)**: productId, unitPrice, quantity — Orderに内包(独立オブジェクトにしない)
- リレーション: Order → User(購入者)、OrderLine → Product

### 2-2. ビューとナビゲーション(インタラクション)

| オブジェクト | コレクション | シングル | アクション |
|---|---|---|---|
| user | `/users` | `/users/:id` — **その顧客の注文一覧を埋め込み(協調)** | なし(Read only) |
| product | `/products` | `/products/:id` | `/products/create` — **保存後に詳細へリダイレクト(命令的遷移)** |
| order | `/orders` | `/orders/:id` — **顧客カード+明細を埋め込み(協調)** | ステータス遷移(その場更新・遷移なしのWriteアクション) |

- ルートナビゲーション: `layouts/default.vue` に users / products / orders のグローバルナビ。
- `/`(トップ)は各コレクションへのリンクのみの簡素なページ。
- 一覧→詳細リンクはすべて**宣言的遷移(パスをprops注入したNuxtLink)**。

### 2-3. レイアウト(プレゼンテーション)
- コレクションはテーブル表示(`BaseTable`)、シングルはカード表示(`BaseCard`)。スタイルはプレーンCSS(scoped)で最小限。

## 3. ディレクトリ全体像(計画)

```
nuxt-ooui-ec-sample/
├── docker/Dockerfile                  ┐
├── docker-compose.yml                 │ 環境インフラ層:
├── .devcontainer/devcontainer.json    │ 「新規プロジェクト 環境構築ガイド」第1部を
├── .claude/settings.json              │ そのまま配置(Nuxt向け差分は
├── pnpm-workspace.yaml                │ 「Nuxt版 環境構築メモ」§1に従う)
├── .github/                           │
│   ├── workflows/ci.yml, audit.yml    │
│   └── dependabot.yml                 ┘
├── package.json / pnpm-lock.yaml      ┐
├── nuxt.config.ts                     │ アプリスタック層:
├── tsconfig.json                      │ 「Nuxt版 環境構築メモ」§2の6ファイル
├── eslint.config.mjs                  │ (@nuxt/eslint + Stylistic + sonarjs)
├── vitest.config.ts / .gitignore      ┘
├── CLAUDE.md                          # アーキテクチャ規約(claude-md-draft.mdを配置)
├── README.md                          # 文書⇔コード対応表、意図的な省略事項の明記
├── app/
│   ├── layouts/default.vue
│   ├── pages/                         # 極薄ページのみ(4責務)
│   │   ├── index.vue
│   │   ├── users/index.vue, [id].vue
│   │   ├── products/index.vue, [id].vue, create.vue
│   │   └── orders/index.vue, [id].vue
│   ├── components/ui/                 # 汎用UI(ドメイン知識なし)
│   │   ├── display/BaseBadge.vue, BaseCard.vue, BaseTable.vue
│   │   └── input/BaseButton.vue, BaseInput.vue, BaseSelect.vue
│   └── features/
│       ├── user/
│       │   ├── components/
│       │   │   ├── UserListContainer.vue / UserList.vue
│       │   │   ├── UserDetailContainer.vue / UserDetail.vue
│       │   │   ├── UserCard.vue       # order featureから参照 → ルート配置(参照構造基準の実例)
│       │   │   └── parts/UserAvatar.vue, UserStatusBadge.vue
│       │   ├── composables/useUsers.ts (+ useUsers.test.ts)
│       │   ├── repositories/userRepository.ts  # interface + fetch実装 + InMemory実装
│       │   └── types/user.ts
│       ├── product/
│       │   ├── components/
│       │   │   ├── ProductListContainer.vue / ProductList.vue
│       │   │   ├── ProductDetailContainer.vue / ProductDetail.vue
│       │   │   ├── ProductForm.vue    # 入力系Baseの組み合わせ
│       │   │   └── parts/ProductStockBadge.vue
│       │   ├── composables/useProducts.ts (+test)
│       │   ├── repositories/productRepository.ts
│       │   └── types/product.ts
│       └── order/
│           ├── components/
│           │   ├── OrderListContainer.vue / OrderList.vue
│           │   ├── OrderDetailContainer.vue / OrderDetail.vue
│           │   └── parts/OrderStatusBadge.vue, OrderLineTable.vue
│           ├── domain/                # 純粋なドメインロジック(UI/fetch非依存) ※§4の規約追記
│           │   ├── orderTotal.ts (+ orderTotal.test.ts — PBT)
│           │   └── orderStatus.ts (+ orderStatus.test.ts — PBT)
│           ├── composables/useOrders.ts (+test)
│           ├── repositories/orderRepository.ts
│           └── types/order.ts
└── server/
    ├── api/
    │   ├── users/index.get.ts, [id].get.ts
    │   ├── products/index.get.ts, [id].get.ts, index.post.ts
    │   └── orders/index.get.ts, [id].get.ts, [id]/status.patch.ts
    └── utils/db.ts                    # インメモリストア + シードデータ(外部依存なし)
```

規模感: ページ8枚、コンポーネント約22個(汎用UI 6 + ドメイン16)、APIハンドラ8本。

## 4. 規約の実演ポイント対応表

| 規約(CLAUDE.md) | リポジトリ内の実例 |
|---|---|
| 汎用UI/ドメイン2分類・依存一方向 | `ui/`はドメイン型import無し。全featureが`ui/`を利用、逆流なし |
| 表示系/入力系の分離 | `display/`はprops-only、`input/`はv-model準拠。`BaseButton`は**入力系**(click発火=書き込み経路。混合型ルールの適用例として明記) |
| 素通しラッパー禁止・小部品の条件 | `UserStatusBadge`(status→色のマッピング)が`BaseBadge`をラップ。`UserForm`的な素通しは作らない |
| 配置の参照構造基準・昇格 | `UserCard`はorder featureから参照されるためルート配置。`UserAvatar`等はparts/ |
| feature間参照(ビューレベルのみ) | order→user(`UserCard`)、user→order(`OrderListContainer`) — 相互参照になるが規約上可。READMEで明記 |
| フルネーム命名・Containerサフィックス | 全コンポーネントで実演 |
| 極薄ページ(4責務)・Container統一 | 全8ページ。fetchはContainer(ページ直下)のみ |
| 命令的遷移のページ集約 | 商品作成: `ProductFormContainer`(仮称`ProductCreateContainer`)が`saved`をemit → `pages/products/create.vue`が`navigateTo` |
| 宣言的リンクのprops注入 | 一覧の各行: ページがパス構築関数を注入、Presentationalが`NuxtLink`描画 |
| 明示import・バレル禁止 | `imports.dirs: []` / `components.dirs: []`。index.ts無し |
| リポジトリ抽象とDIP | interface + fetch実装(本番) + InMemory実装(テスト)。composableは抽象依存 |
| 1 composable = 1責務 | `useUsers` / `useProducts` / `useOrders` |
| Pinia限定使用 | **意図的に不使用**(横断状態が存在しない規模)。READMEに判断を記載 |

**規約への追記(本計画で決定する差分)**: 純粋なドメインロジックの置き場として`features/<object>/domain/`を追加する(UIにもfetchにも依存しない関数。根拠: SRPとテスト容易性 — PBTの主対象)。リポジトリ構築時にCLAUDE.mdへ1項目追記する。

## 5. 技術スタック・開発環境

- **Nuxt 3最新(3.x) + `future.compatibilityVersion: 4`**(`app/`構成)。バージョンは構築開始時にregistry.npmjs.orgから最新安定版を確定(環境構築ガイド§4)。
- 環境インフラ層は環境構築ガイド第1部をそのまま採用(Docker + devcontainer + Claude Codeサンドボックス + CI/audit/dependabot + pnpmサプライチェーン対策)。
- Lint/Format: **@nuxt/eslint一本 + ESLint Stylistic**(indent 2 / double quotes / semi / trailing commas multiline)+ sonarjs(認知的複雑度15 warn)+ 関数80行warn(テスト300行)。CIは`--max-warnings=0`。
- テスト: Vitest + @nuxt/test-utils(happy-dom)+ @vue/test-utils + fast-check。テストは対象と同ディレクトリに併置。

## 6. テスト計画

| 対象 | 手法 | 内容 |
|---|---|---|
| `order/domain/orderTotal.ts` | **PBT(fast-check)** | 合計の非負性、明細順序の入れ替え不変性、明細追加の加法性 |
| `order/domain/orderStatus.ts` | **PBT(fast-check)** | 遷移の不変条件(後退遷移不可、completed/cancelledは終端、任意の遷移列で不変条件が破れない) |
| 各リポジトリInMemory実装 | ユニット | CRUD整合(findAll/findの一貫性) |
| 各composable | ユニット | InMemoryリポジトリ注入で検証(**DIPの実演**: ルーター・HTTP不要) |
| 代表Presentational(`UserList`等) | コンポーネント | props→描画、リンクパスがprops経由であること |

## 7. 作業ステップ(コミット単位)

1. 環境インフラ層の配置 + 全バージョンの確定(registry照会)
2. Nuxtアプリスタック層のscaffold(6ファイル + `app/`最小構成、`pnpm dev`起動確認)
3. `CLAUDE.md`(domain/追記込み)とREADME骨子の配置
4. 汎用UI(`ui/display/` 3点、`ui/input/` 3点)
5. `server/`インメモリAPI + シードデータ + 各featureの`types/`
6. feature/user一式(repository → composable → components → pages、協調の受け側)
7. feature/product一式(+ create画面と命令的遷移)
8. feature/order一式(domain/のPBT対象ロジック、協調の埋め込み、ステータス遷移)
9. テスト拡充(PBT・composable・コンポーネント)、`check:ci`/`type-check`/`test`/`build`の全通過確認
10. README仕上げ(§4の対応表を完成させ、省略事項を明記)

各ステップ完了時にコミットする(意味のある単位)。

## 8. 成果物・受け渡し・検証範囲

- **納品物**: プロジェクト一式のzip。ユーザーが展開して`git init`→GitHubへpush(新規ブランチにupstreamは設定しない。PRを作る場合は必ずDraft)。
- **検証範囲の制約**: 構築作業環境ではDockerが使えないため、Dockerイメージのビルドとdevcontainer接続の検証は**ユーザーのホストで実施**。作業環境ではpnpm直接実行で`pnpm check:ci` / `type-check` / `test` / `build`の全通過を確認して納品する。
- 初回起動手順(ホスト): `mkdir -p ~/.claude` → `docker compose up -d --build` → `http://localhost:3000`。

## 9. 意図的な省略事項(READMEにも記載)

- 認証・認可(middleware)、ページネーション・検索、E2Eテスト(Playwright)、i18n、本番デプロイ設定、Pinia(横断状態が無いため)、段階3(Layers/monorepo)への備え。
- いずれも「サンプルの焦点(アーキテクチャ規約の実演)を薄めないため」の省略であり、規約上の禁止ではない。

## 10. リスク・未確定事項

- Nuxt 3.x最新 + `compatibilityVersion: 4`と@nuxt/test-utils・@nuxt/eslintの組み合わせ整合は、バージョン確定時に検証する(不整合時はマイナーを1つ下げる判断をユーザーに確認)。
- `eslint-plugin-sonarjs`のESLint 9(flat config)対応バージョンの確認が必要。非対応ならESLint coreの`complexity`で代替(要確認)。
- `pnpm-workspace.yaml`の`onlyBuiltDependencies`へ追加が必要なパッケージ(esbuild等)はinstall時の警告で確定する。
- リポジトリ名`nuxt-ooui-ec-sample`は仮。変更があれば置換する。
