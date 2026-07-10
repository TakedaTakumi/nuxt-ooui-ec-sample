// プロパティベーステスト(fast-check): 合計計算が任意の明細に対して満たすべき性質を検証する。
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import type { OrderLine } from "../types/order";
import { orderLineTotal, orderTotal } from "./orderTotal";

// 単価は非負の金額、数量は非負の整数(業務上の定義域)。
const orderLineArb = fc.record<OrderLine>({
  productId: fc.string(),
  unitPrice: fc.integer({ min: 0, max: 1_000_000 }),
  quantity: fc.integer({ min: 0, max: 1_000 }),
});

const orderLinesArb = fc.array(orderLineArb, { maxLength: 30 });

// 配列とその置換(順序だけ入れ替えた同じ明細)の組。
const linesWithPermutationArb = orderLinesArb.chain(lines =>
  fc.tuple(
    fc.constant(lines),
    fc.shuffledSubarray(lines, { minLength: lines.length, maxLength: lines.length }),
  ),
);

describe("orderTotal", () => {
  it("明細が空なら合計は0", () => {
    expect(orderTotal([])).toBe(0);
  });

  it("非負性: 単価・数量が非負なら合計も非負", () => {
    fc.assert(
      fc.property(orderLinesArb, (lines) => {
        expect(orderTotal(lines)).toBeGreaterThanOrEqual(0);
      }),
    );
  });

  it("順序不変性: 明細の順序を入れ替えても合計は変わらない", () => {
    fc.assert(
      fc.property(linesWithPermutationArb, ([lines, shuffled]) => {
        expect(orderTotal(shuffled)).toBe(orderTotal(lines));
      }),
    );
  });

  it("加法性: 明細列の連結の合計は各合計の和に等しい", () => {
    fc.assert(
      fc.property(orderLinesArb, orderLinesArb, (a, b) => {
        expect(orderTotal([...a, ...b])).toBe(orderTotal(a) + orderTotal(b));
      }),
    );
  });

  it("単一明細: 合計は単価×数量に等しい", () => {
    fc.assert(
      fc.property(orderLineArb, (line) => {
        expect(orderTotal([line])).toBe(line.unitPrice * line.quantity);
        expect(orderLineTotal(line)).toBe(line.unitPrice * line.quantity);
      }),
    );
  });
});
