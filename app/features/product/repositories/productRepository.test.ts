// InMemory実装のCRUD整合: findAll / find の一貫性と create の反映を検証する。
import { describe, expect, it } from "vitest";
import type { Product } from "../types/product";
import { createInMemoryProductRepository } from "./productRepository";

const seed: Product[] = [
  { id: "p1", name: "コーヒー豆", price: 1200, stock: 42 },
  { id: "p2", name: "マグカップ", price: 1500, stock: 0 },
];

describe("createInMemoryProductRepository", () => {
  it("findAll / find の一貫性: 全件の各要素は find でも同じ内容で取得できる", async () => {
    const repo = createInMemoryProductRepository(seed);
    for (const product of await repo.findAll()) {
      await expect(repo.find(product.id)).resolves.toEqual(product);
    }
  });

  it("create した商品は findAll / find の両方に反映される", async () => {
    const repo = createInMemoryProductRepository(seed);
    const created = await repo.create({ name: "ティーポット", price: 3200, stock: 3 });
    await expect(repo.findAll()).resolves.toContainEqual(created);
    await expect(repo.find(created.id)).resolves.toEqual(created);
  });

  it("create は元のシード配列を破壊しない", async () => {
    const repo = createInMemoryProductRepository(seed);
    await repo.create({ name: "ドリッパー", price: 800, stock: 12 });
    expect(seed).toHaveLength(2);
  });

  it("find は存在しない id で reject する", async () => {
    const repo = createInMemoryProductRepository(seed);
    await expect(repo.find("missing")).rejects.toThrow("Product not found: missing");
  });
});
