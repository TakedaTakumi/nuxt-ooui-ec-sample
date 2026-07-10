// アクション(ステータス遷移): PATCH /api/orders/:id/status
// 画面遷移を伴わないその場更新のWriteアクション(OOUIの「オブジェクトに対するアクション」)。
// 遷移規則はクライアントと同じdomain/の純粋関数で検証する(規則の二重定義を避ける)。
import type { OrderStatus } from "~/features/order/types/order";
import { ORDER_STATUSES, canTransition } from "~/features/order/domain/orderStatus";
import { db } from "../../../utils/db";

function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && (ORDER_STATUSES as readonly string[]).includes(value);
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody<{ status?: unknown }>(event);
  if (!isOrderStatus(body?.status)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid order status" });
  }
  const current = id === undefined ? undefined : db.findOrder(id);
  if (current === undefined) {
    throw createError({ statusCode: 404, statusMessage: "Order not found" });
  }
  if (!canTransition(current.status, body.status)) {
    throw createError({
      statusCode: 409,
      statusMessage: `Invalid transition: ${current.status} -> ${body.status}`,
    });
  }
  return db.updateOrderStatus(id as string, body.status);
});
