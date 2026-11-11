/** 完整成员管理示例，演示多个通用组件如何组合；数据和查询状态属于页面。 */
import { useRef, useState } from "react";
import {
  Button,
  DataTable,
  Descriptions,
  Drawer,
  FilterBar,
  Input,
  Select,
  Statistic,
  Tag,
  type TableSort,
} from "@lec-space/liquidglass";

interface Member {
  id: string;
  name: string;
  direction: string;
  hours: number;
  status: string;
}
const members: Member[] = [
  {
    id: "01",
    name: "林同学",
    direction: "Web 前端",
    hours: 12,
    status: "active",
  },
  {
    id: "02",
    name: "陈同学",
    direction: "后端研发",
    hours: 8,
    status: "active",
  },
  {
    id: "03",
    name: "周同学",
    direction: "基础设施",
    hours: 16,
    status: "active",
  },
  { id: "04", name: "李同学", direction: "Web 前端", hours: 6, status: "new" },
  { id: "05", name: "王同学", direction: "后端研发", hours: 4, status: "new" },
  { id: "06", name: "赵同学", direction: "设计", hours: 10, status: "active" },
];
export default function Example() {
  const trigger = useRef<HTMLButtonElement | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(3);
  const [sort, setSort] = useState<TableSort | null>(null);
  const [keys, setKeys] = useState<string[]>([]);
  const [member, setMember] = useState<Member | null>(null);
  const filtered = members.filter(
    (row) => row.name.includes(query) && (!status || row.status === status),
  );
  const sorted = [...filtered];
  if (sort?.key === "hours")
    sorted.sort(
      (a, b) => (a.hours - b.hours) * (sort.direction === "asc" ? 1 : -1),
    );
  const rows = sorted.slice((page - 1) * size, page * size);
  return (
    <div style={{ display: "grid", gap: 24, width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <Statistic title="工作室成员" value={members.length} suffix="人" />
        <Statistic
          title="本周累计"
          value={members.reduce((sum, row) => sum + row.hours, 0)}
          suffix="小时"
        />
      </div>
      <FilterBar
        onClear={() => {
          setQuery("");
          setStatus("");
          setPage(1);
        }}
      >
        <Input
          aria-label="查询成员姓名"
          placeholder="按姓名搜索"
          value={query}
          onValueChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
        />
        <Select
          aria-label="筛选成员状态"
          placeholder="全部状态"
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
          options={[
            { value: "active", label: "正式成员" },
            { value: "new", label: "新成员" },
          ]}
        />
      </FilterBar>
      <DataTable
        caption="成员管理列表"
        data={rows}
        rowKey={(row) => row.id}
        sort={sort}
        manualSorting
        onSortChange={setSort}
        selection={{ keys, onChange: setKeys }}
        toolbar={<strong>成员列表</strong>}
        bulkActions={(selected) => (
          <Button size="small" onClick={() => setKeys([])}>
            清除 {selected.length} 项选择
          </Button>
        )}
        pagination={{
          total: sorted.length,
          page,
          pageSize: size,
          pageSizeOptions: [3, 6],
          onPageChange: setPage,
          onPageSizeChange: (next) => {
            setSize(next);
            setPage(1);
          },
        }}
        columns={[
          { key: "name", title: "成员", render: (row) => row.name },
          {
            key: "hours",
            title: "本周时长",
            sortable: true,
            render: (row) => row.hours + " 小时",
          },
          {
            key: "status",
            title: "状态",
            render: (row) => (
              <Tag>{row.status === "active" ? "正式成员" : "新成员"}</Tag>
            ),
          },
          {
            key: "actions",
            title: "操作",
            render: (row) => (
              <Button
                size="small"
                aria-label={"查看 " + row.name}
                onClick={(event) => {
                  trigger.current = event.currentTarget;
                  setMember(row);
                }}
              >
                详情
              </Button>
            ),
          },
        ]}
      />
      <Drawer
        returnFocusRef={trigger}
        open={member !== null}
        onOpenChange={(open) => {
          if (!open) setMember(null);
        }}
        title={member?.name ?? "成员详情"}
        footer={
          <Button variant="filled" onClick={() => setMember(null)}>
            完成
          </Button>
        }
      >
        {member && (
          <Descriptions
            columns={1}
            items={[
              { key: "name", label: "姓名", value: member.name },
              { key: "direction", label: "技术方向", value: member.direction },
              {
                key: "hours",
                label: "本周时长",
                value: member.hours + " 小时",
              },
            ]}
          />
        )}
      </Drawer>
    </div>
  );
}
