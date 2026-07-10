// シングル: GET /api/products/:id ⇔ /products/:id
import { db } from "../../utils/db";

export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id");
  const product = id === undefined ? undefined : db.findProduct(id);
  if (product === undefined) {
    throw createError({ statusCode: 404, statusMessage: "Product not found" });
  }
  return product;
});
