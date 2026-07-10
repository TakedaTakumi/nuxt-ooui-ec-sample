// order(注文)オブジェクトのドメイン型。
// OrderLine(明細)は独立オブジェクトにせず Order に内包する(OOUIのオブジェクト抽出の判断)。

export type OrderStatus = "received" | "shipped" | "completed" | "cancelled";

export interface OrderLine {
  productId: string;
  unitPrice: number; // 注文時点の単価スナップショット(商品価格の変更に影響されない)
  quantity: number;
}

export interface Order {
  id: string;
  userId: string; // 購入者(user オブジェクトへのリレーション)
  orderLines: OrderLine[];
  status: OrderStatus;
  orderedAt: string; // ISO 8601
}
