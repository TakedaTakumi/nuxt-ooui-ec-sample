// DIPの実演: InMemoryリポジトリの注入でHTTPなしに取得・ステータス遷移を検証する。
import { describe, expect, it } from "vitest";
import type { Order } from "../types/order";
import { createInMemoryOrderRepository } from "../repositories/orderRepository";
import { useOrders } from "./useOrders";

const seed: Order[] = [
  {
    id: "o1",
    userId: "u1",
    orderLines: [{ productId: "p1", unitPrice: 1200, quantity: 2 }],
    status: "received",
    orderedAt: "2026-07-01T09:30:00.000Z",
  },
  {
    id: "o2",
    userId: "u2",
    orderLines: [{ productId: "p2", unitPrice: 980, quantity: 1 }],
    status: "completed",
    orderedAt: "2026-06-10T18:45:00.000Z",
  },
];

describe("useOrders", () => {
  it("list は全件を返し、userId指定でその顧客の注文だけに絞り込む", async () => {
    const { list } = useOrders(createInMemoryOrderRepository(seed));
    await expect(list()).resolves.toHaveLength(2);
    const filtered = await list("u1");
    expect(filtered.map(order => order.id)).toEqual(["o1"]);
  });

  it("detail は id に一致する1件を返す", async () => {
    const { detail } = useOrders(createInMemoryOrderRepository(seed));
    const order = await detail("o2");
    expect(order.status).toBe("completed");
  });

  it("updateStatus は許可された遷移を適用する(received → shipped)", async () => {
    const { detail, updateStatus } = useOrders(createInMemoryOrderRepository(seed));
    const updated = await updateStatus("o1", "shipped");
    expect(updated.status).toBe("shipped");
    await expect(detail("o1")).resolves.toMatchObject({ status: "shipped" });
  });

  it("updateStatus は許可されない遷移を reject する(completed は終端)", async () => {
    const { updateStatus } = useOrders(createInMemoryOrderRepository(seed));
    await expect(updateStatus("o2", "received")).rejects.toThrow(
      "Invalid transition: completed -> received",
    );
  });
});
