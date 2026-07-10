// リポジトリ層: API呼び出しを抽象(interface)の背後に隠蔽する(DIP)。
import type { Product, ProductCreateInput } from "../types/product";

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  find(id: string): Promise<Product>;
  create(input: ProductCreateInput): Promise<Product>;
}

// 本番実装: Nitro の /api/products を呼ぶ。
export function createFetchProductRepository(): ProductRepository {
  return {
    findAll: () => $fetch<Product[]>("/api/products"),
    find: id => $fetch<Product>(`/api/products/${id}`),
    create: input => $fetch<Product>("/api/products", { method: "POST", body: input }),
  };
}

// テスト用実装: HTTPに依存せず、採番もローカルで完結する。
export function createInMemoryProductRepository(seed: Product[]): ProductRepository {
  const products = [...seed];
  let seq = products.length;
  return {
    findAll: () => Promise.resolve(products),
    find: (id) => {
      const product = products.find(target => target.id === id);
      return product === undefined
        ? Promise.reject(new Error(`Product not found: ${id}`))
        : Promise.resolve(product);
    },
    create: (input) => {
      seq += 1;
      const product: Product = { id: `p${seq}`, ...input };
      products.push(product);
      return Promise.resolve(product);
    },
  };
}
