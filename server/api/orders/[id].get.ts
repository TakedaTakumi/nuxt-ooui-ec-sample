// シングル: GET /api/orders/:id ⇔ /orders/:id
import { db } from "../../utils/db";

export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id");
  const order = id === undefined ? undefined : db.findOrder(id);
  if (order === undefined) {
    throw createError({ statusCode: 404, statusMessage: "Order not found" });
  }
  return order;
});
