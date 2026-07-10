// 1 composable = 1責務(userの取得)。
// 抽象(UserRepository)に依存し、具体実装は呼び出し側(Container/テスト)が注入する(DIP)。
import type { User } from "../types/user";
import type { UserRepository } from "../repositories/userRepository";

export function useUsers(repo: UserRepository) {
  const list = (): Promise<User[]> => repo.findAll(); // コレクション
  const detail = (id: string): Promise<User> => repo.find(id); // シングル
  return { list, detail };
}
