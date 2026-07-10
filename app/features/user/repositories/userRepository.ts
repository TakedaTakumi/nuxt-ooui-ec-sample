// リポジトリ層: API呼び出しを抽象(interface)の背後に隠蔽する(DIP)。
// composable/コンポーネントは UserRepository にのみ依存し、
// 本番は fetch 実装、テストは InMemory 実装を注入して差し替える。
import type { User } from "../types/user";

export interface UserRepository {
  findAll(): Promise<User[]>;
  find(id: string): Promise<User>;
}

// 本番実装: Nitro の /api/users を呼ぶ($fetch はフレームワーク組み込みAPI)。
export function createFetchUserRepository(): UserRepository {
  return {
    findAll: () => $fetch<User[]>("/api/users"),
    find: id => $fetch<User>(`/api/users/${id}`),
  };
}

// テスト用実装: HTTPに一切依存せず、与えられたシードだけで動く。
export function createInMemoryUserRepository(seed: User[]): UserRepository {
  const users = [...seed];
  return {
    findAll: () => Promise.resolve(users),
    find: (id) => {
      const user = users.find(target => target.id === id);
      return user === undefined
        ? Promise.reject(new Error(`User not found: ${id}`))
        : Promise.resolve(user);
    },
  };
}
