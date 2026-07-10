// DIPの実演: InMemoryリポジトリの注入でHTTPなしに取得・作成を検証する。
import { describe, expect, it } from "vitest";
import type { Product } from "../types/product";
import { createInMemoryProductRepository } from "../repositories/productRepository";
import { useProducts } from "./useProducts";

const seed: Product[] = [
  { id: "p1", name: "コーヒー豆", price: 1200, stock: 42 },
  { id: "p2", name: "マグカップ", price: 1500, stock: 0 },
];

describe("useProducts", () => {
  it("list はリポジトリの全件をそのまま返す", async () => {
    const { list } = useProducts(createInMemoryProductRepository(seed));
    await expect(list()).resolves.toEqual(seed);
  });

  it("detail は id に一致する1件を返す", async () => {
    const { detail } = useProducts(createInMemoryProductRepository(seed));
    await expect(detail("p2")).resolves.toEqual(seed[1]);
  });

  it("create は採番された新しい商品を返し、一覧にも反映される", async () => {
    const { list, create } = useProducts(createInMemoryProductRepository(seed));
    const created = await create({ name: "ティーポット", price: 3200, stock: 3 });
    expect(created).toEqual({ id: "p3", name: "ティーポット", price: 3200, stock: 3 });
    await expect(list()).resolves.toHaveLength(3);
  });

  it("detail は存在しない id で reject する", async () => {
    const { detail } = useProducts(createInMemoryProductRepository(seed));
    await expect(detail("missing")).rejects.toThrow("Product not found: missing");
  });
});
