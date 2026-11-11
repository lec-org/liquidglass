import { ImportWizard, Table } from "@lec-space/liquidglass";

interface Preview {
  names: string[];
}
export default function Example() {
  return (
    <ImportWizard<Preview>
      title="导入成员清单"
      accept=".json"
      inspect={async (files, signal) => {
        const text = await files[0]!.text();
        if (signal.aborted) throw new DOMException("已取消", "AbortError");
        const data: unknown = JSON.parse(text);
        if (
          !Array.isArray(data) ||
          !data.length ||
          data.some((name) => typeof name !== "string")
        ) {
          throw new Error(
            '示例文件内容应为非空姓名数组，例如 ["林同学","陈同学"]',
          );
        }
        return { names: data };
      }}
      publish={async (_, signal) => {
        // 组件站仅演示流程。实际项目在此调用带草稿 ID 的发布接口。
        if (signal.aborted) throw new DOMException("已取消", "AbortError");
      }}
      renderPreview={(preview) => (
        <Table
          caption="待导入的成员"
          data={preview.names.map((name, index) => ({
            id: String(index),
            name,
          }))}
          rowKey={(row) => row.id}
          columns={[{ key: "name", title: "姓名", render: (row) => row.name }]}
        />
      )}
    />
  );
}
