// リポジトリ層: API呼び出しを抽象(interface)の背後に隠蔽する(DIP)。
import type { Order, OrderStatus } from "../types/order";
import { canTransition } from "../domain/orderStatus";

export interface OrderRepository {
  findAll(userId?: string): Promise<Order[]>;
  find(id: string): Promise<Order>;
  updateStatus(id: string, status: OrderStatus): Promise<Order>;
}

// 本番実装: Nitro の /api/orders を呼ぶ。
export function createFetchOrderRepository(): OrderRepository {
  return {
    findAll: userId =>
      $fetch<Order[]>("/api/orders", { query: userId === undefined ? {} : { userId } }),
    find: id => $fetch<Order>(`/api/orders/${id}`),
    updateStatus: (id, status) =>
      $fetch<Order>(`/api/orders/${id}/status`, { method: "PATCH", body: { status } }),
  };
}

// テスト用実装: HTTPに依存しない。遷移規則はサーバー実装と同じdomain関数で検証する。
export function createInMemoryOrderRepository(seed: Order[]): OrderRepository {
  const orders = seed.map(order => ({ ...order, orderLines: [...order.orderLines] }));
  const findOrder = (id: string) => orders.find(target => target.id === id);
  return {
    findAll: userId =>
      Promise.resolve(
        userId === undefined ? orders : orders.filter(order => order.userId === userId),
      ),
    find: (id) => {
      const order = findOrder(id);
      return order === undefined
        ? Promise.reject(new Error(`Order not found: ${id}`))
        : Promise.resolve(order);
    },
    updateStatus: (id, status) => {
      const order = findOrder(id);
      if (order === undefined) {
        return Promise.reject(new Error(`Order not found: ${id}`));
      }
      if (!canTransition(order.status, status)) {
        return Promise.reject(new Error(`Invalid transition: ${order.status} -> ${status}`));
      }
      order.status = status;
      return Promise.resolve(order);
    },
  };
}
