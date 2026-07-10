// product(商品)オブジェクトのドメイン型。

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

// 作成アクション(/products/create)の入力。idはサーバー側で採番する。
export type ProductCreateInput = Omit<Product, "id">;
