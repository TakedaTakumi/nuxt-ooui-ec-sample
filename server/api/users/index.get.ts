// コレクション: GET /api/users ⇔ /users(OOUI・REST・ルーティングの三位一体)
import { db } from "../../utils/db";

export default defineEventHandler(() => db.listUsers());
