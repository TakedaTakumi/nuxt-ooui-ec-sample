// DIPの実演: InMemoryリポジトリを注入するだけで、ルーターもHTTPも用意せずに検証できる。
import { describe, expect, it } from "vitest";
import type { User } from "../types/user";
import { createInMemoryUserRepository } from "../repositories/userRepository";
import { useUsers } from "./useUsers";

const seed: User[] = [
  { id: "u1", name: "佐藤 花子", email: "hanako@example.com", status: "active" },
  { id: "u2", name: "鈴木 一郎", email: "ichiro@example.com", status: "suspended" },
];

describe("useUsers", () => {
  it("list はリポジトリの全件をそのまま返す", async () => {
    const { list } = useUsers(createInMemoryUserRepository(seed));
    await expect(list()).resolves.toEqual(seed);
  });

  it("detail は id に一致する1件を返す", async () => {
    const { detail } = useUsers(createInMemoryUserRepository(seed));
    await expect(detail("u2")).resolves.toEqual(seed[1]);
  });

  it("detail は存在しない id で reject する", async () => {
    const { detail } = useUsers(createInMemoryUserRepository(seed));
    await expect(detail("missing")).rejects.toThrow("User not found: missing");
  });
});
