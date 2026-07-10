// アクション(ステータス遷移): PATCH /api/orders/:id/status
// 画面遷移を伴わないその場更新のWriteアクション(OOUIの「オブジェクトに対するアクション」)。
import type { OrderStatus } from "~/features/order/types/order";
import { db } from "../../../utils/db";

const ORDER_STATUSES: readonly OrderStatus[] = ["received", "shipped", "completed", "cancelled"];

function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && (ORDER_STATUSES as readonly string[]).includes(value);
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody<{ status?: unknown }>(event);
  if (!isOrderStatus(body?.status)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid order status" });
  }
  const order = id === undefined ? undefined : db.updateOrderStatus(id, body.status);
  if (order === undefined) {
    throw createError({ statusCode: 404, statusMessage: "Order not found" });
  }
  return order;
});
