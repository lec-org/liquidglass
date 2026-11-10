import { useState } from "react";
import { TabBar } from "@lec-org/liquidglass";
import { House, Compass, Heart } from "lucide-react";

export default function Example() {
  const [tab, setTab] = useState("home");
  return (
    <div style={{ display: "grid", gap: 24, justifyItems: "center" }}>
      <output>当前页面：{tab}</output>
      <TabBar
        aria-label="应用导航"
        value={tab}
        onValueChange={setTab}
        items={[
          { value: "home", label: "首页", icon: <House size={20} /> },
          { value: "explore", label: "探索", icon: <Compass size={20} /> },
          { value: "saved", label: "收藏", icon: <Heart size={20} /> },
        ]}
      />
    </div>
  );
}
