// 1 composable = 1責務(orderの取得とステータス遷移)。
// 抽象(OrderRepository)に依存し、具体実装は呼び出し側が注入する(DIP)。
import type { Order, OrderStatus } from "../types/order";
import type { OrderRepository } from "../repositories/orderRepository";

export function useOrders(repo: OrderRepository) {
  const list = (userId?: string): Promise<Order[]> => repo.findAll(userId); // コレクション
  const detail = (id: string): Promise<Order> => repo.find(id); // シングル
  const updateStatus = (id: string, status: OrderStatus): Promise<Order> =>
    repo.updateStatus(id, status); // アクション(その場更新)
  return { list, detail, updateStatus };
}
