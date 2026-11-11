import { Descriptions, Tag } from "@lec-space/liquidglass";
export default function Example() {
  return (
    <Descriptions
      items={[
        { key: "project", label: "项目", value: "LecOJ" },
        { key: "owner", label: "维护团队", value: "LEC 工作室" },
        { key: "environment", label: "环境", value: <Tag>开发环境</Tag> },
        { key: "update", label: "最近更新", value: "今天 14:20" },
      ]}
    />
  );
}
