// user(顧客)オブジェクトのドメイン型。
// OOUIのオブジェクト抽出(モデル)に対応し、リポジトリ・composable・コンポーネントが共有する。

export type UserStatus = "active" | "suspended";

export interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
}
