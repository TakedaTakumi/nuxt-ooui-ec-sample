// シングル: GET /api/users/:id ⇔ /users/:id
import { db } from "../../utils/db";

export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id");
  const user = id === undefined ? undefined : db.findUser(id);
  if (user === undefined) {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }
  return user;
});
