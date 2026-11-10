import { useState } from "react";
import { SegmentedControl } from "@lec-org/liquidglass";

export default function Example() {
  const [view, setView] = useState("week");
  return (
    <div style={{ display: "grid", gap: 20, textAlign: "center" }}>
      <SegmentedControl
        aria-label="日历视图"
        value={view}
        onValueChange={setView}
        items={[
          { value: "day", label: "日" },
          { value: "week", label: "周" },
          { value: "month", label: "月" },
        ]}
      />
      <output>当前视图：{view}</output>
    </div>
  );
}
