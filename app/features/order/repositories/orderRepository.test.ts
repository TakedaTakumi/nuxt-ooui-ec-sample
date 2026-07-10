// InMemory実装のCRUD整合: findAll / find の一貫性・絞り込み・遷移規則の適用を検証する。
import { describe, expect, it } from "vitest";
import type { Order } from "../types/order";
import { createInMemoryOrderRepository } from "./orderRepository";

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
    status: "shipped",
    orderedAt: "2026-06-24T13:05:00.000Z",
  },
];

describe("createInMemoryOrderRepository", () => {
  it("findAll / find の一貫性: 全件の各要素は find でも同じ内容で取得できる", async () => {
    const repo = createInMemoryOrderRepository(seed);
    for (const order of await repo.findAll()) {
      await expect(repo.find(order.id)).resolves.toEqual(order);
    }
  });

  it("findAll(userId) は絞り込み後も全件の部分集合を返す", async () => {
    const repo = createInMemoryOrderRepository(seed);
    const all = await repo.findAll();
    const filtered = await repo.findAll("u1");
    expect(filtered.every(order => order.userId === "u1")).toBe(true);
    expect(filtered.every(order => all.includes(order))).toBe(true);
  });

  it("updateStatus の結果は find にも反映される", async () => {
    const repo = createInMemoryOrderRepository(seed);
    await repo.updateStatus("o2", "completed");
    await expect(repo.find("o2")).resolves.toMatchObject({ status: "completed" });
  });

  it("updateStatus は遷移規則違反を reject し、状態を変えない", async () => {
    const repo = createInMemoryOrderRepository(seed);
    await expect(repo.updateStatus("o2", "received")).rejects.toThrow(
      "Invalid transition: shipped -> received",
    );
    await expect(repo.find("o2")).resolves.toMatchObject({ status: "shipped" });
  });

  it("リポジトリ内の変更は元のシード配列に影響しない", async () => {
    const repo = createInMemoryOrderRepository(seed);
    await repo.updateStatus("o1", "cancelled");
    expect(seed[0]?.status).toBe("received");
  });
});
