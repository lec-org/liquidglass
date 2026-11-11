import { useState } from "react";
import { Button, DataTable, Tag } from "@lec-org/liquidglass";
const rows = [
  { id: "lin", name: "林同学", hours: 12 },
  { id: "chen", name: "陈同学", hours: 8 },
  { id: "zhou", name: "周同学", hours: 16 },
];
export default function Example() {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <div style={{ width: "100%", display: "grid", gap: 16 }}>
      <DataTable
        caption="工作室成员"
        data={rows}
        rowKey={(row) => row.id}
        selection={{ keys: selected, onChange: setSelected }}
        toolbar={<span>工作室成员 · 本周</span>}
        bulkActions={(keys) => (
          <Button size="small" onClick={() => setSelected([])}>
            清除 {keys.length} 项选择
          </Button>
        )}
        columns={[
          {
            key: "name",
            title: "成员",
            render: (row) => row.name,
            compare: (a, b) => a.name.localeCompare(b.name),
          },
          {
            key: "hours",
            title: "本周时长",
            render: (row) => <Tag>{row.hours} 小时</Tag>,
            compare: (a, b) => a.hours - b.hours,
          },
        ]}
      />
      <output>已选 {selected.length} 人</output>
    </div>
  );
}
