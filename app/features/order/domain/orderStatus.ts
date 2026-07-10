// 純粋なドメインロジック(domain/): 注文ステータスの遷移規則。
// UIにもfetchにも依存せず、クライアント(Container)とサーバー(APIハンドラ)の両方から
// 同じ規則として参照される。プロパティベーステスト(orderStatus.test.ts)の主対象。
import type { OrderStatus } from "../types/order";

export const ORDER_STATUSES: readonly OrderStatus[] = [
  "received",
  "shipped",
  "completed",
  "cancelled",
];

// ユビキタス言語としての表示名(値→名前の対応はドメインの語彙とみなす)。
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  received: "受付済み",
  shipped: "発送済み",
  completed: "完了",
  cancelled: "キャンセル",
};

// 遷移規則: received → shipped → completed の一方向。
// received / shipped からは cancelled へ移れる。completed / cancelled は終端。
const TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  received: ["shipped", "cancelled"],
  shipped: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

// 現在のステータスから遷移できるステータスの一覧(終端なら空配列)。
export function nextStatuses(current: OrderStatus): readonly OrderStatus[] {
  return TRANSITIONS[current];
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return TRANSITIONS[from].includes(to);
}
