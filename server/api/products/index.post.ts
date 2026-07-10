// アクション(作成): POST /api/products ⇔ /products/create
import type { ProductCreateInput } from "~/features/product/types/product";
import { db } from "../../utils/db";

function parseInput(body: unknown): ProductCreateInput | undefined {
  if (typeof body !== "object" || body === null) {
    return undefined;
  }
  const { name, price, stock } = body as Record<string, unknown>;
  if (typeof name !== "string" || name.trim() === "") {
    return undefined;
  }
  if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
    return undefined;
  }
  if (typeof stock !== "number" || !Number.isInteger(stock) || stock < 0) {
    return undefined;
  }
  return { name: name.trim(), price, stock };
}

export default defineEventHandler(async (event) => {
  const input = parseInput(await readBody(event));
  if (input === undefined) {
    throw createError({ statusCode: 400, statusMessage: "Invalid product payload" });
  }
  setResponseStatus(event, 201);
  return db.createProduct(input);
});
