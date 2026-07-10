// 純粋なドメインロジック(domain/): UIにもfetchにも依存しない合計計算。
// プロパティベーステスト(orderTotal.test.ts)の主対象。
import type { OrderLine } from "../types/order";

// 明細1行の小計 = 単価 × 数量。
export function orderLineTotal(line: OrderLine): number {
  return line.unitPrice * line.quantity;
}

// 注文全体の合計 = 全明細の小計の総和。
export function orderTotal(orderLines: readonly OrderLine[]): number {
  return orderLines.reduce((sum, line) => sum + orderLineTotal(line), 0);
}
