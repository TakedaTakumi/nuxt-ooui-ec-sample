// 代表Presentationalのコンポーネントテスト:
// - props → 描画の写像であること
// - リンクの遷移先がpropsで注入したパス構築関数に由来すること(ルーティング非依存の検証)
// NuxtLink はNuxtランタイムの提供物なので、素のVueとして検証するためスタブに差し替える。
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import type { User } from "../types/user";
import UserList from "./UserList.vue";

const users: User[] = [
  { id: "u1", name: "佐藤 花子", email: "hanako@example.com", status: "active" },
  { id: "u2", name: "鈴木 一郎", email: "ichiro@example.com", status: "suspended" },
];

const NuxtLinkStub = {
  props: ["to"],
  template: "<a :href=\"to\"><slot /></a>",
};

function mountUserList() {
  return mount(UserList, {
    props: {
      users,
      detailPath: (id: string) => `/stubbed/${id}`,
    },
    global: {
      stubs: { NuxtLink: NuxtLinkStub },
    },
  });
}

describe("UserList", () => {
  it("propsで受け取った顧客を全行描画する", () => {
    const wrapper = mountUserList();
    expect(wrapper.findAll("tbody tr")).toHaveLength(2);
    expect(wrapper.text()).toContain("佐藤 花子");
    expect(wrapper.text()).toContain("ichiro@example.com");
  });

  it("ステータスはUserStatusBadgeのマッピングで表示される", () => {
    const wrapper = mountUserList();
    expect(wrapper.text()).toContain("有効");
    expect(wrapper.text()).toContain("停止中");
  });

  it("リンク先は注入されたパス構築関数の結果になる(パス構築の知識を持たない)", () => {
    const wrapper = mountUserList();
    const hrefs = wrapper.findAll("a").map(a => a.attributes("href"));
    expect(hrefs).toEqual(["/stubbed/u1", "/stubbed/u2"]);
  });
});
