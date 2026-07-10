// インメモリストア + シードデータ(外部依存なし)。
// サンプルの焦点はフロントエンドのアーキテクチャ規約の実演なので、
// 永続化は行わずプロセス内のデータで完結させる(再起動でシード状態に戻る)。
// 型はドメイン型(features/<object>/types/)を import type で共有し、
// API境界とフロントの型を一致させる(型のみの参照なのでランタイム依存は生じない)。
import type { User } from "~/features/user/types/user";
import type { Product } from "~/features/product/types/product";
import type { Order, OrderStatus } from "~/features/order/types/order";

const users: User[] = [
  { id: "u1", name: "佐藤 花子", email: "hanako.sato@example.com", status: "active" },
  { id: "u2", name: "鈴木 一郎", email: "ichiro.suzuki@example.com", status: "active" },
  { id: "u3", name: "高橋 美咲", email: "misaki.takahashi@example.com", status: "suspended" },
];

const products: Product[] = [
  { id: "p1", name: "ブレンドコーヒー豆 200g", price: 1200, stock: 42 },
  { id: "p2", name: "ドリップバッグ 10個入", price: 980, stock: 0 },
  { id: "p3", name: "マグカップ", price: 1500, stock: 8 },
  { id: "p4", name: "ティーポット", price: 3200, stock: 3 },
];

const orders: Order[] = [
  {
    id: "o1",
    userId: "u1",
    orderLines: [
      { productId: "p1", unitPrice: 1200, quantity: 2 },
      { productId: "p3", unitPrice: 1500, quantity: 1 },
    ],
    status: "received",
    orderedAt: "2026-07-01T09:30:00.000Z",
  },
  {
    id: "o2",
    userId: "u1",
    orderLines: [
      { productId: "p2", unitPrice: 980, quantity: 3 },
    ],
    status: "shipped",
    orderedAt: "2026-06-24T13:05:00.000Z",
  },
  {
    id: "o3",
    userId: "u2",
    orderLines: [
      { productId: "p4", unitPrice: 3200, quantity: 1 },
      { productId: "p1", unitPrice: 1150, quantity: 1 },
    ],
    status: "completed",
    orderedAt: "2026-06-10T18:45:00.000Z",
  },
  {
    id: "o4",
    userId: "u3",
    orderLines: [
      { productId: "p3", unitPrice: 1500, quantity: 2 },
    ],
    status: "cancelled",
    orderedAt: "2026-06-02T08:00:00.000Z",
  },
];

let productSeq = products.length;

export const db = {
  listUsers(): User[] {
    return users;
  },
  findUser(id: string): User | undefined {
    return users.find(user => user.id === id);
  },
  listProducts(): Product[] {
    return products;
  },
  findProduct(id: string): Product | undefined {
    return products.find(product => product.id === id);
  },
  createProduct(input: Omit<Product, "id">): Product {
    productSeq += 1;
    const product: Product = { id: `p${productSeq}`, ...input };
    products.push(product);
    return product;
  },
  listOrders(userId?: string): Order[] {
    return userId === undefined ? orders : orders.filter(order => order.userId === userId);
  },
  findOrder(id: string): Order | undefined {
    return orders.find(order => order.id === id);
  },
  updateOrderStatus(id: string, status: OrderStatus): Order | undefined {
    const order = orders.find(target => target.id === id);
    if (order === undefined) {
      return undefined;
    }
    order.status = status;
    return order;
  },
};
