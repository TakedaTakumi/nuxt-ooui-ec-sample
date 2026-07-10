// 1 composable = 1責務(productの取得と作成)。
// 抽象(ProductRepository)に依存し、具体実装は呼び出し側が注入する(DIP)。
import type { Product, ProductCreateInput } from "../types/product";
import type { ProductRepository } from "../repositories/productRepository";

export function useProducts(repo: ProductRepository) {
  const list = (): Promise<Product[]> => repo.findAll(); // コレクション
  const detail = (id: string): Promise<Product> => repo.find(id); // シングル
  const create = (input: ProductCreateInput): Promise<Product> => repo.create(input); // アクション
  return { list, detail, create };
}
