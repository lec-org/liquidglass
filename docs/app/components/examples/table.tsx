import { Table, Tag } from "@lec-org/liquidglass";
const rows = [
  { id: "1", name: "两数之和", tag: "数组" },
  { id: "2", name: "有效括号", tag: "栈" },
  { id: "3", name: "合并区间", tag: "排序" },
];
export default function Example() {
  return (
    <Table
      caption="训练题目"
      rowKey={(row) => row.id}
      data={rows}
      columns={[
        { key: "name", title: "题目", render: (row) => row.name },
        { key: "tag", title: "知识点", render: (row) => <Tag>{row.tag}</Tag> },
      ]}
    />
  );
}
