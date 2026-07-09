# アーキテクチャ規約(OOUI × 分割統治)

このプロジェクトはオブジェクト指向UI(OOUI)を採用する。オブジェクト(名詞)を起点にUIを構成し、各オブジェクトにコレクションビュー(一覧)とシングルビュー(詳細)を対応させる。分割の単位は常にOOUIのオブジェクトに揃えること(モデリングとディレクトリ構造の一致)。OOUI・REST・ルーティングは三位一体で対応する: コレクション ⇔ `GET /users` ⇔ `/users`、シングル ⇔ `GET /users/:id` ⇔ `/users/:id`。

構成は**オブジェクト単位のfeature別**とする。ドメインの実体(コンポーネント・ロジック・リポジトリ・型)は`features/<object>/`に凝集し、`pages/`はルーティング定義としてNuxt標準位置に置く。`pages/users/`と`features/user/`は鏡写しの関係になる。

## ディレクトリ構成

```
app/
├── pages/                        # 極薄ページのみ(ルーティング境界)
│   └── users/
│       ├── index.vue             # コレクション(一覧)
│       ├── [id].vue              # シングル(詳細)
│       └── create.vue            # アクション(作成)
├── components/
│   └── ui/                       # 汎用UI(共通・ドメイン知識なし)
│       ├── display/              # 表示系(props-only)
│       └── input/                # 入力系(v-model準拠)
├── features/
│   └── user/                     # オブジェクト単位に集約
│       ├── components/
│       │   ├── UserListContainer.vue
│       │   ├── UserList.vue
│       │   ├── UserDetailContainer.vue
│       │   ├── UserDetail.vue
│       │   ├── UserForm.vue
│       │   └── parts/            # 内部部品(このfeature内からのみ参照)
│       ├── composables/
│       │   └── useUsers.ts
│       ├── repositories/
│       │   └── userRepository.ts
│       └── types/
│           └── user.ts
└── server/api/                   # Nitro(BFF)
```

## コンポーネント規約

- コンポーネントは**汎用UI(`components/ui/`)とドメイン(`features/<object>/components/`)の2分類**とする。汎用UIはfeatureに属さない共通資産であり、ドメイン型(`User`等)をimportしてはならない。依存は常に「ドメイン → 汎用UI」の一方向とし、逆流を禁止する。
  - 根拠: 依存の一方向性そのものが分割統治であり、DIPの実践であるため。
- 汎用UIは**表示系(`ui/display/`)と入力系(`ui/input/`)にディレクトリ分離**する。表示系は`defineProps`のみで完結し`defineEmits`禁止。入力系は`v-model`(`defineModel`)に準拠する。表示と入力を兼ねる混合型(トグル等)は入力系として扱う。
  - 根拠: 「書き込み経路を持つか」で責務・複雑さ・テスト戦略が分かれるため(CQS/ISPのUI部品への適用)。
- 入力系の名前は`Input` / `Select` / `Picker` / `Field` / `Form`等の語彙で終えること。表示系は`Text` / `Badge` / `Card` / `List`等。
  - 根拠: ファイルツリーとimport文の名前だけで系統を判別できるようにするため。
- ドメインコンポーネント内でBase部品を**直接使ってよい**。propsを横流しするだけの素通しラッパーは禁止。ドメイン知識(値→表示のマッピング、制約、定型的組み合わせ)をカプセル化できるときだけドメイン小部品を作る。
  - 根拠: 機械的なラップ強制は無意味なコンポーネントの量産を招くため。
- `features/<object>/components/`のルート直下には、ページ/Containerから直接参照される**ビューレベル**のコンポーネントのみを置く。feature内からのみ参照される内部部品は`components/parts/`に置く。内部部品が後からページ直参照になったら`parts/`からルートへ移動する。サブディレクトリ名に`ui/`を使わないこと。
  - 根拠: 境界を粒度でなく参照構造(客観的に判定可能)にするため。ルートにビュー一覧が並び`pages/`と鏡写しになる。
- 他featureのコンポーネント参照は**可**(例: 注文詳細にユーザーカードを埋め込む)。ただし参照先は相手featureの`components/`直下のビューレベルに限り、`parts/`への参照は禁止。
  - 根拠: オブジェクト協調はOOUIの原則であるため許可する。`parts/`は「feature内からのみ参照」という定義の帰結として外部参照不可。
- 命名は**フルネーム方式**とする(`features/user/components/UserDetail.vue` — ディレクトリ名との重複は意図的)。
  - 根拠: オブジェクト協調によるfeature横断利用・grep可能性・デバッグ時の一意性のため。重複はDRY違反ではない。
- サフィックスは**Containerのみ**に付ける。`Container`サフィックスが付いていないコンポーネントはすべて表示専用(props+emitのみ)である。
  - 根拠: 例外(ロジックを持つ側)にだけ印を付ければ1つの規則で全ファイルを分類できるため。

## ページ(pages/)規約

- ページはfeatureに含めず、Nuxt標準の`pages/`に置く。
  - 根拠: 本規約のページはルーティング知識のみを持つ結節点であり、ドメインの実体ではないため。
- ページの責務は次の**4つのみ**: (1) URLパラメータ/クエリの取り出し・型変換、(2) `definePageMeta`/`useHead`等のページメタ宣言、(3) Containerへの委譲、(4) 画面遷移の実行。ドメインの表示ロジックとAPI直接呼び出しは禁止。
  - 根拠: それ以外の責務はすべて`features/`側の層が持つため。
- **全ページでContainer分離を統一**する(ページ自身がfetchを兼ねる方式は採らない)。データ取得はContainerがcomposable → リポジトリ経由で行う。Containerは必ずページの直下に置き、fetchを行うコンポーネントのネストを深くしないこと。
  - 根拠: Containerのページ外(モーダル等)再利用を無条件に可能にするため。ネスト制限はSSR時のリクエストのウォーターフォール回避のため。

```vue
<!-- pages/users/[id].vue の標準形 -->
<script setup lang="ts">
import UserDetailContainer from '~/features/user/components/UserDetailContainer.vue'

definePageMeta({ middleware: 'auth' })
const route = useRoute()
const userId = route.params.id as string
</script>

<template>
  <UserDetailContainer :user-id="userId" />
</template>
```

## 画面遷移規約

- **遷移先(URL)の知識はすべてページに一元化**する。Container/Presentationalはルーティングに依存してはならない。
  - 根拠: 遷移はルーティング知識でありページの責務。下の層から排除することで再利用とテスト(ルーターのモック不要)が容易になる。
- 命令的遷移: Containerは結果をemitで報告するだけで`navigateTo`を呼ばない。遷移の実行はページが担う。
- 宣言的リンク: Presentationalは`<NuxtLink>`を描画してよいが、遷移先パスはpropsで注入する。パス構築の知識を持たせないこと。

```vue
<!-- 命令的遷移: pages/users/create.vue -->
<template>
  <UserCreateContainer @saved="(id: string) => navigateTo(`/users/${id}`)" />
</template>
```

```vue
<!-- 宣言的リンク: ページがパス構築関数をpropsで注入し、Presentationalは描画するだけ -->
<!-- pages側:  <UserListContainer :detail-path="(id) => `/users/${id}`" /> -->
<!-- UserList.vue側: <NuxtLink :to="detailPath(user.id)">{{ user.name }}</NuxtLink> -->
```

## import規約

- 自動importは**フレームワーク組み込みAPI(`ref`, `useFetch`, `definePageMeta`等)のみ**とする。自作コード(`features/`配下・`components/ui/`)は必ず明示importする。
  - 根拠: 依存関係をgrepと定義ジャンプで追跡可能に保つため。自動と明示の混在は「書き忘れか自動か」を判別不能にするため、この方針に例外を作らない。

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  imports: { dirs: [] },      // composables/ utils/ のスキャン停止
  components: { dirs: [] },   // components/ のスキャン停止
})
```

- `NuxtLink`や`ClientOnly`等のNuxt組み込みコンポーネントは上記設定の対象外なので、そのまま使用してよい。
- **バレルファイル(`index.ts`での再export)は禁止**。importパスは実ファイルを直接指すこと。
  - 根拠: 循環依存の温床であり、tree-shaking・コード分割・HMR性能を損なうため。

## ロジック層規約

- **1 composable = 1責務**。`useUserAndPosts`のような複数責務は`useUser` / `usePosts`に分ける。composableは対応するfeatureの`features/<object>/composables/`に置く。
  - 根拠: composableの本質は再利用性ではなく責任分離(SRP)であるため。
- API呼び出しは**リポジトリ層(`features/<object>/repositories/`)に隠蔽**し、composable/コンポーネントはinterface(抽象)に依存させる。本番実装とモック実装を差し替え可能に保つこと。
  - 根拠: DIPによりテスト容易性を確保するため。

```ts
// features/user/repositories/userRepository.ts
export interface UserRepository {
  findAll(): Promise<User[]>
  find(id: string): Promise<User>
}
// features/user/composables/useUsers.ts — 抽象に依存し、具体実装は注入する
export function useUsers(repo: UserRepository) { /* ... */ }
```

- 状態管理: スコープの限定された状態はcomposable(または`useState`)。Piniaは**アプリ横断のグローバル状態(認証・設定等)に限定**する。
  - 根拠: 何でもストアに置くとスコープと寿命の管理が崩れるため。
