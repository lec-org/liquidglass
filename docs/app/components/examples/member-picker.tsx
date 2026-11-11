import { useState } from "react";
import { MemberPicker } from "@lec-org/liquidglass";
export default function Example() {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <MemberPicker
        aria-label="选择项目成员"
        placeholder="添加成员"
        value={selected}
        onValueChange={setSelected}
        members={[
          { id: "lin", name: "林同学", description: "前端研发", group: "研发" },
          {
            id: "chen",
            name: "陈同学",
            description: "后端研发",
            group: "研发",
          },
          { id: "zhou", name: "周同学", description: "导师", group: "导师" },
        ]}
      />
      <output>已选 {selected.length} 位成员</output>
    </div>
  );
}
