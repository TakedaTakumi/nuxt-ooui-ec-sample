// コレクション: GET /api/products ⇔ /products
import { db } from "../../utils/db";

export default defineEventHandler(() => db.listProducts());
