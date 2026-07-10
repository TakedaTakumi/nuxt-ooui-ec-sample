// コレクション: GET /api/orders ⇔ /orders
// userId クエリで購入者による絞り込みに対応する(顧客詳細への注文一覧の埋め込みで使用)。
import { db } from "../../utils/db";

export default defineEventHandler((event) => {
  const { userId } = getQuery(event);
  return db.listOrders(typeof userId === "string" ? userId : undefined);
});
