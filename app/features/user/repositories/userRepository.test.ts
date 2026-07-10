// InMemory実装のCRUD整合: findAll が返す全要素が find でも同じ内容で取得できること。
import { describe, expect, it } from "vitest";
import type { User } from "../types/user";
import { createInMemoryUserRepository } from "./userRepository";

const seed: User[] = [
  { id: "u1", name: "佐藤 花子", email: "hanako@example.com", status: "active" },
  { id: "u2", name: "鈴木 一郎", email: "ichiro@example.com", status: "suspended" },
];

describe("createInMemoryUserRepository", () => {
  it("findAll はシードの全件を返す", async () => {
    const repo = createInMemoryUserRepository(seed);
    await expect(repo.findAll()).resolves.toEqual(seed);
  });

  it("findAll / find の一貫性: 全件の各要素は find でも同じ内容で取得できる", async () => {
    const repo = createInMemoryUserRepository(seed);
    for (const user of await repo.findAll()) {
      await expect(repo.find(user.id)).resolves.toEqual(user);
    }
  });

  it("find は存在しない id で reject する", async () => {
    const repo = createInMemoryUserRepository(seed);
    await expect(repo.find("missing")).rejects.toThrow("User not found: missing");
  });
});
