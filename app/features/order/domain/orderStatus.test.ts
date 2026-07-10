// プロパティベーステスト(fast-check): ステータス遷移規則の不変条件を検証する。
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import type { OrderStatus } from "../types/order";
import { ORDER_STATUSES, canTransition, nextStatuses } from "./orderStatus";

const statusArb = fc.constantFrom<OrderStatus>(...ORDER_STATUSES);

// 進行度: received → shipped → completed の一方向性を数値で表す(cancelled は進行外の終端)。
const RANK: Record<OrderStatus, number> = {
  received: 0,
  shipped: 1,
  completed: 2,
  cancelled: -1,
};

describe("orderStatus", () => {
  it("後退遷移不可: 許可される遷移は進行度+1 か cancelled への離脱のみ", () => {
    fc.assert(
      fc.property(statusArb, statusArb, (from, to) => {
        if (canTransition(from, to)) {
          expect(to === "cancelled" || RANK[to] === RANK[from] + 1).toBe(true);
        }
      }),
    );
  });

  it("終端性: completed / cancelled からはどこへも遷移できない", () => {
    fc.assert(
      fc.property(statusArb, (to) => {
        expect(canTransition("completed", to)).toBe(false);
        expect(canTransition("cancelled", to)).toBe(false);
      }),
    );
  });

  it("nextStatuses と canTransition は一致する", () => {
    fc.assert(
      fc.property(statusArb, statusArb, (from, to) => {
        expect(nextStatuses(from).includes(to)).toBe(canTransition(from, to));
      }),
    );
  });

  it("任意の遷移列で不変条件が破れない(終端後の変化なし・成功遷移は高々2回)", () => {
    fc.assert(
      fc.property(fc.array(statusArb, { maxLength: 20 }), (attempts) => {
        let current: OrderStatus = "received";
        let successes = 0;
        for (const attempt of attempts) {
          const terminal = nextStatuses(current).length === 0;
          if (canTransition(current, attempt)) {
            // 終端からの遷移成功はあり得ない
            expect(terminal).toBe(false);
            current = attempt;
            successes += 1;
          }
        }
        // received からの遷移列は最長でも received→shipped→completed/cancelled の2回
        expect(successes).toBeLessThanOrEqual(2);
        expect(ORDER_STATUSES).toContain(current);
      }),
    );
  });
});
